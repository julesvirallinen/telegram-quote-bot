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
            var syntax = "sti!:" + msg.reply_to_message.sticker.file_id;
            if (match[4]) {
                syntax += "(" + match[4] + " )";
            }
            addQuote(msg.from.id, msg, syntax);
            return;
        }
    }

    if (match[4] == undefined) {
        return;
    }

    addQuote(msg.from.id, msg, match[4]);

}


function addQuote(addedBy, msg, toAdd) {
    var chatId = msg.chat.id;

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
            group: groupId,
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

function delQuote(msg, match) {
    var chatId = msg.chat.id;
    if (msg.from.id != process.env.JULIUS) {
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