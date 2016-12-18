/**
 * Created by julkku on 12/11/16.
 */

module.exports = function (bot) {
    var db = require('./quotes');
    var config = require('../config');


    function addGroup(chatId) {

        // console.log(msg);

        var newGroup = db.Group({
            chatId: chatId,
            lastQuote: 0
        });
        newGroup.save(function (err) {
            if (err) throw err;
            bot.sendMessage(chatId, "Group or user added! :)");

        });
    }

    function addToGroup(addedBy, chatId, toAdd) {
        var groupId = 0;
        var quoteId = 0;

        db.Group.findOne({chatId: chatId}, function (err, group) {
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
                if (quote) {
                    // quoteId = quote._id;
                    bot.sendMessage(chatId, "Saved quote: " + quote.quote, quote._id);
                } else {
                    console.log(err)
                    bot.sendMessage(chatId, "lol no");

                }
            });
        })


    }


    function escape(text) {
        return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
    };

    function getQuoteForGroup(chatId, group_id, search) {
        var re = new RegExp(escape(search.trim()), "i");
        console.log("regex ", re);

        db.Quote.findRandom({group: group_id, quote: re}, function (err, quote) {
            // console.log(quote);
            if (quote[0]) {
                sendToChat(chatId, quote[0].quote, quote[0]._id);
                // bot.sendMessage(chatId, quote[0].quote);
            } else {
                getQuoteForGroup(chatId, group_id, '.');
            }
        });
    };

    function sendToChat(chatId, message, quoteId) {
        console.log(message.substr(0, 5), message.substr(5, 31), message.substr(36));
        if (message.length > 7 && message.substr(0, 5) == 'sti!:') {
            var stickerId = message.split(':')[1].split('(')[0];

            try {
                bot.sendSticker(chatId, stickerId);
            } catch (err) {
                console.log("invalid sticker syntax " + err)
            } finally {
                return;
            }
        }
        if (quoteId) {
            var options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [[
                        {text: '😀', callback_data: '+|' + quoteId},
                        {text: "😑", callback_data: '-|' + quoteId},
                        {text: "❌", callback_data: '0'}
                    ]]
                })
            };
            bot.sendMessage(chatId, message, options);
            return;
        }

        bot.sendMessage(chatId, message);

    }

    bot.on('callback_query', function onCallbackQuery(callbackQuery) {
        console.log(callbackQuery)

        var parts = callbackQuery.data.split('|');
        var options = {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id
        };

        if (parts[0] == '+' || parts[0] == '-') {
            db.Quote.findById(parts[1], function (err, quote) {
                console.log("quoteData ", quote);
                console.log("ratingup ", config.rate.up, isNaN(config.rate.up));
                console.log("quoteRating ", quote.rating, isNaN(quote.rating));
                if (quote) {

                    // var rating = 0;
                    if (quote.rating) var rating = quote.rating;

                    if (parts[0] == '+') rating = rating + config.rate.solid;
                    if (parts[0] == '-') rating = rating * config.rate.down;
                    console.log(rating);
                    quote.rating = rating;

                    quote.save(function (err, quote) {
                        if (err) throw err;

                        console.log(quote);
                    });
                    bot.answerCallbackQuery(callbackQuery.id, "new rating: " + rating);

                      var options = {
                            chat_id: callbackQuery.message.chat.id,
                            message_id: callbackQuery.message.message_id
                    };
                    bot.editMessageText(callbackQuery.message.text, options);

                    // sendToChat(chatId, quote[0].quote, quote[0]._id);
                    // bot.sendMessage(chatId, quote[0].quote);
                }
            });


            // bot.editMessageText('Rated ' + value, options);
        }
        // else bot.editMessageText('Ok then, have a good day!', options);
        return true;

    });


    function sentTotallyRandom(chatId) {
        db.Quote.findRandom(function (err, quote) {
            if (quote[0]) {
                sendToChat(chatId, quote[0].quote);
            } else {
                getQuoteForGroup(chatId, group_id, '.');
            }
        });

    }

    bot.onText(/\/start/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, group) {
            if (!group) {

                addGroup(chatId);
                return;
            }

            bot.sendMessage(msg.chat.id, "Group already exists! :)");
        });

    });

    bot.onText(/\/(sleep(\@puppy2_bot)?)/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, arr) {
            var d = new Date();
            if (d.getTime() - arr.lastQuote < config.spamSec*1000) {
                console.log("Already asleep! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
                return;
            }
            arr.lastQuote = d.getTime() + config.sleepTime*1000;
            arr.save(function (err) {
                if (err) throw err;
                console.log("sleeping for 200 seconds");
                bot.sendMessage(msg.chat.id, "ok, ,___, ");

            });
        });
    });

    bot.onText(/\/(quote(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, arr) {


            var d = new Date();
            if (d.getTime() - arr.lastQuote < config.spamSec*1000) {
                console.log("Blocked for spam! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
                return;
                // if (arr.lastRequestBy == msg.from.id && msg.chat.type != 'private') {
                //     console.log("blocked for spam from person");
                //     return;
                // }
            }

            if (match[4] == undefined) {
                if (Math.random() < 0.005) {
                    sentTotallyRandom(chatId);
                    return;
                }
                getQuoteForGroup(chatId, arr._id, '.');
            } else {
                console.log("searching for: " + match[4]);
                getQuoteForGroup(chatId, arr._id, match[4]);
            }

            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;
            arr.save(function (err) {
                if (err) throw err;
                // console.log('!');
            });
        });
    });

    bot.onText(/\/(imfeelinglucky(\@puppy2_bot)?)/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, arr) {


            var d = new Date();
            if (d.getTime() - arr.lastQuote < 10000) {
                console.log("Blocked for spam! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
                return;
                // if (arr.lastRequestBy == msg.from.id && msg.chat.type != 'private') {
                //     console.log("blocked for spam from person");
                //     return;
                // }
            }
            sentTotallyRandom(chatId);

            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;
            arr.save(function (err) {
                if (err) throw err;
                // console.log('!');
            });
        });
    });

    bot.onText(/\/(add(\@puppy2_bot)?) (.+)/, function (msg, match) {
        var chatId = msg.chat.id;
        console.log(match)
        addToGroup(msg.from.id, chatId, match[3]);
    });


}
;

