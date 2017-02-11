var db = require('./quotes');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN, {polling: true});
var config = require('../config');


function start(msg) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, group) {
        if (err) {
            console.log(err.stack);
        }
        if (!group) {

            addGroup(chatId);
            return;
        }

        bot.sendMessage(msg.chat.id, "Group already exists! :)");
    });

}

function sleep(msg) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, arr) {
        if (err) {
            console.log(err.stack);
            return;
        }
        var d = new Date();
        if (d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Already asleep! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
            return;
        }

        arr.lastQuote = d.getTime() + config.sleepTime * 1000;

        arr.save(function (err) {
            if (err) throw err;
            console.log("sleeping for 200 seconds");
            bot.sendMessage(msg.chat.id, "ok, ,___, ");

        });
    });

}

function stats(msg) {
    var chatId = msg.chat.id;
    console.log("made it to stats!");

    db.Group.findOne({chatId: chatId}, function (err, arr) {
        if (err) {
            console.log(err.stack);
            return;
        }
        var d = new Date();
        if (d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Spam block! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
            return;
        }
        bot.sendMessage(chatId, "Quotes requested: " + arr.counts.requests + ". Quotes returned: " + arr.counts.returned);

    });

}

function quote(msg, match) {
    var chatId = msg.chat.id;
    db.Group.findOne({chatId: chatId}, function (err, arr) {
        if (err) {
            console.log(err.stack);
            return;
        }

        if (!arr.counts.returned) {
            arr.counts.returned = 0;
            arr.counts.requests = 0;
        }

        var d = new Date();
        if (d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Blocked for spam! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
        } else {

            //sometimes sends quote from entire pool of quotes. 
            if (match[4] === undefined) {
                if (Math.random() < 0.005) {
                    sentTotallyRandom(msg);
                    return;
                }

                getQuoteForGroup(msg, arr._id, '.');

            } else {

                console.log("searching for: " + match[4]);
                getQuoteForGroup(msg, arr._id, match[4]);
            }

            // Sets time for previous quote and saves group. 
            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;

            arr.counts.returned++;

        }

        arr.counts.requests++;
        arr.save(function (err) {
            if (err) throw err;
            // console.log('!');
        });

    });

}

function imfeelinglucky(msg) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, arr) {
        if (err) {
            console.log(err.stack);
            return;
        }

        var d = new Date();
        if (d.getTime() - arr.lastQuote < 10000) {
            console.log("Blocked for spam! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
            return;
            // if (arr.lastRequestBy == msg.from.id && msg.chat.type != 'private') {
            //     console.log("blocked for spam from person");
            //     return;
            // }
        } else {
            sentTotallyRandom(msg);

            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;
            // arr.counts.returned = 1;

        }
        // arr.counts.requests = 1;
        arr.save(function (err) {
            if (err) {
                console.log(err.stack);
                return;
            }
        });

    });

}

function add(msg, match) {
    console.log(msg)
    var chatId = msg.chat.id;

    if (msg.reply_to_message) {
        if (msg.reply_to_message.text) {
            addQuote(msg.from.id, msg, msg.reply_to_message.text);
            return;
        }

        if (msg.reply_to_message.sticker) {
            var syntax = "sti!:" + msg.reply_to_message.sticker.file_id;
            if (match[4]) {
                syntax += "(" + match[4] + " )";
            }
            addQuote(msg.from.id, msg, syntax);
            return;
        }
    }

    if (match[4] === undefined) {
        return;
    }

    addQuote(msg.from.id, msg, match[4]);

}

function voteCallback(callbackQuery) {
    //this seems to be missing a row or two... i'll have to find it...
    if (parts[0] === '+' || parts[0] === '-') {
        db.Quote.findById(parts[1], function (err, quote) {
            if (err) {
                console.log(err.stack);
                return;
            }

            if (quote) {
                if (quote.rating) var rating = quote.rating;
                if (parts[0] === '+') rating++;
                if (parts[0] === '-') rating--;
                quote.rating = rating;

                quote.save(function (err, quote) {
                    if (err) {
                        console.log(err.stack);
                        return;
                    }
                    console.log(quote);
                });
                bot.answerCallbackQuery(callbackQuery.id, "new rating: " + rating);
            }
        });


    }
    var options = {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id
    };
    bot.editMessageText(callbackQuery.message.text, options);


}

function addGroup(chatId) {

    // console.log(msg);

    var newGroup = db.Group({
        chatId: chatId,
        lastQuote: 0
    });
    newGroup.save(function (err) {
        if (err) {
            console.log(err.stack);
            return;
        }
        bot.sendMessage(chatId, "Group or user added! :)");

    });
}

function addQuote(addedBy, msg, toAdd) {
    var chatId = msg.chat.id;

    var groupId = 0;
    var quoteId = 0;

    db.Group.findOne({chatId: chatId}, function (err, group) {
        if (err) {
            console.log(err.stack);
            return;
        }

        if (!group) {
            return;
        }
        groupId = group._id;

        var newQuote = db.Quote({
            quote: toAdd,
            addedBy: addedBy,
            group: groupId
        });

        newQuote.save(function (err, quote) {
            if (err) {
                console.log(err.stack);
                return;
            }

            if (quote) {
                // quoteId = quote._id;
                // bot.sendMessage(chatId, "Saved quote: " + quote.quote, quote._id);
                sendToChat(msg, "Saved quote: " + quote.quote, quote._id);
            } else {
                bot.sendMessage(chatId, "lol no");

            }
        });
    })


}


function escape(text) {
    return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
}

function getQuoteForGroup(msg, group_id, search) {
    search = search.replace(/\[a\]/g, "").trim();

    var re = new RegExp(escape(search.trim()), "i");

    db.Quote.findRandom({group: group_id, quote: re}, function (err, quote) {
        if (err) {
            console.log(err.stack);
            return;
        }
        if (quote[0]) {
            sendToChat(msg, quote[0].quote, quote[0]._id);
        } else {
            getQuoteForGroup(msg, group_id, '.');
            // I hope this never loops and kills everything...
        }
    });
}

function sendToChat(msg, message, quoteId) {
    console.log(msg)
    var chatId = msg.chat.id;
    if (message.length > 7 && message.substr(0, 5) === 'sti!:') {
        var stickerId = message.split(':')[1].split('(')[0];

        try {
            bot.sendSticker(chatId, stickerId);
        } catch (err) {
            console.log("invalid sticker syntax " + err)
        } finally {
            return;
        }
    }

    var options = {
        parse_mode: "Markdown"
    };

    if (message === process.env.OLLI1) {
        bot.sendMessage(chatId, process.env.OLLI2, options);
        return
    }
    message = message.replace(":user:", msg.from.first_name);
    if (msg.text && msg.text.indexOf("[a]") !== -1) {
        message = message.split("");
        message = message.join(" ");
    }


    bot.sendMessage(chatId, message, options);

}


function sentTotallyRandom(msg) {
    var chatId = msg.chat.id;

    db.Quote.findRandom(function (err, quote) {
        if (err) {
            console.log(err.stack);
            return;
        }

        if (quote[0]) {
            sendToChat(msg, quote[0].quote);
        } else {
            getQuoteForGroup(chatId, group_id, '.');
        }
    });

}

function findQuote(msg, match) {
    if (msg.from.id != process.env.JULIUS) {
        return;
    }
    var chatId = msg.chat.id;
    var re = new RegExp(escape(match[3].trim()), "i");

    db.Quote.find({quote: re}, function (err, quote) {
        if (err) {
            console.log(err.stack);
            return;
        }
        if (quote) {
            for (var i in quote) {
                bot.sendMessage(chatId, quote[i].quote + " " + quote[i]._id)
            }
        }
    });
}

function delQuote(msg, match) {
    var chatId = msg.chat.id;
    if (msg.from.id !== process.env.JULIUS) {
        return;
    }
    db.Quote.find({_id: match[3]}).remove().exec(function (err) {
        if (err) {
            bot.sendMessage(chatId, "couldn't find it")
            return;
        }
        bot.sendMessage(chatId, "deleted it :P")
    })
}


module.exports = {
    quote: quote,
    start: start,
    imfeelinglucky: imfeelinglucky,
    add: add,
    voteCallback: voteCallback,
    findQuote: findQuote,
    delQuote: delQuote,
    stats: stats
};


