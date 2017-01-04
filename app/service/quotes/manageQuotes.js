var db = require('./../../schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('../../config');
var botOutput = require('../../botOutput');

function add(msg, match) {
    var chatId = msg.chat.id;

    if (msg.reply_to_message) {
        if (msg.reply_to_message.text) {
            addQuote(msg.from.id, msg, msg.reply_to_message.text);
            return;
        }

        if (msg.reply_to_message.sticker) {
            addByType(msg, match, 'sticker');
            return;
        }

        if(msg.reply_to_message.voice){
            addByType(msg, match,  'voice');
            return;
        }

        if(msg.reply_to_message.audio){
            addByType(msg, match,  'audio');
            return;
        }

    }

    if (match[4] == undefined) {
        return;
    }

    addQuote(msg.from.id, msg, match[4]);

}

function addByType(msg, match, type) {
    if(msg.reply_to_message[type]){
        var quote = match[4];
        if (!match[4]) {
            quote = type;
        }
        addQuote(msg.from.id, msg, quote, type, msg.reply_to_message[type].file_id);
        return;

    }
}


function addQuote(addedBy, msg, toAdd, type, resourceId) {
    var chatId = msg.chat.id;

    var groupId = 0;
    var quoteId = 0;

    db.Group.findOne({chatId: chatId}, function (err, group) {
        if (!group) {
            return;
        }
        groupId = group._id;

        if(!type){
            type = "text";
        }

        var newQuote = db.Quote({
            quote: toAdd,
            addedBy: addedBy,
            group: groupId,
            type: type,
            resourceId: resourceId,
            votes: {
                upVotes: 0,
                downVotes: 0
            }
        });





        newQuote.save(function (err, quote) {
            if (quote) {
                // quoteId = quote._id;
                // bot.sendMessage(chatId, "Saved quote: " + quote.quote, quote._id);
                botOutput.sendQuote(msg, quote, ":user: added quote: ");
            } else {
                console.log(err);
                bot.sendMessage(chatId, "lol no");

            }
        });
    })
};

function delQuote(msg, match, idBool) {
    var chatId = msg.chat.id;
    if (msg.from.id != process.env.JULIUS) {
        return;
    }
    if (idBool) {
        db.Quote.find({_id: match[3]}).remove().exec(function (err) {
            if (err) {
                botOutput.sendMessage(msg, "couldn't find it")
                return;
            }
            botOutput.sendMessage(msg, "deleted it :P")
        })
    } else {

        var re = new RegExp(match[3], "i");

        db.Quote.find({quote: re}, function (err, quote) {
            if(quote.length>1){
                botOutput.sendMessage(msg, "found " + quote.length + " quotes, did nothing.");
                findQuote(msg, match);
            }
            if(quote.length==1){
                var text = "*deleted quote*: " + quote[0].quote;
                db.Quote.findByIdAndRemove(quote[0]._id, function(err) {
                    botOutput.sendMessage(msg, text);

                })



            } else {
                botOutput.sendMessage(msg, "found nothing...");

            }
        });
    }

}

function findQuote(msg, match) {
    var chatId = msg.chat.id;
    var re = new RegExp(escape(match[3].trim()), "i");

    db.Quote.find({quote: re}, function (err, quote) {
        if (msg.from.id != process.env.JULIUS) {
            return;
        }
        if (quote) {
            for (var i in quote) {
                bot.sendMessage(chatId, quote[i].quote + " " + quote[i]._id)
            }
        }
    });
}


module.exports = {
    add: add,
    findQuote: findQuote,
    delQuote: delQuote,
}