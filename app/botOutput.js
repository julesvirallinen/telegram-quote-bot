var db = require('./schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('./config');

var moment = require('moment');
moment().format();


function sendMessage(msg, message) {
    var options = {
        parse_mode: "Markdown"
    };

    bot.sendMessage(msg.chat.id, parseMessage(msg, message), options);
}

function sendQuote(msg, quote, message) {
    if (message) {
        quoteSender(msg, message + quote.quote);
        return;
    }


    if ((quote.quote.length > 7 && quote.quote.substr(0, 5) == 'sti!:') || quote.type && quote.type == 'sticker') {
        sendSticker(msg, quote);
        return;
    }

    if(quote.type && quote.type != 'text'){
        sendFileType(msg, quote);
        return;
    }


    quoteSender(msg, quote.quote, quote._id);
}

function quoteSender(msg, message, quoteId) {
    var chatId = msg.chat.id;

    message = parseMessage(msg, message);

    options = getOptions(quoteId);

    bot.sendMessage(chatId, message, options);

}

function sendFileType(msg, quote) {
    var chatId = msg.chat.id;
    var options = getOptions(quote._id);

    if(quote.type == 'voice'){
        bot.sendVoice(chatId, quote.resourceId, options);
        return;
    }

    if(quote.type == 'audio'){
        bot.sendAudio(chatId, quote.resourceId, options);
        return;
    }



}

function sendSticker(msg, quote) {
    var chatId = msg.chat.id;
    var options = getOptions(quote._id);

    console.log(quote);
    var message = quote.quote;
    // FOR DEPRECATED STICKER SYNTAX, YEAH ILL DEAL WITH IT LATER
    if (quote.quote.substr(0, 5) == 'sti!:') {
        var stickerId = quote.quote.split(':')[1].split('(')[0];
        try {
            console.log(stickerId);
            bot.sendSticker(chatId, stickerId, options);
        } catch (err) {
            console.log("invalid sticker syntax " + err)
        }
        return;
    }
    if (quote.type == 'sticker') {
        bot.sendSticker(chatId, quote.resourceId, options);
    }

}

function getOptions(quoteId) {
    if (!quoteId) {
        var options = {
            parse_mode: "Markdown"
        };
    } else {


        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [[
                    {text: '😀', callback_data: '+|' + quoteId},
                    {text: "😑", callback_data: '-|' + quoteId},
                    {text: "❌", callback_data: '0'}
                ]]
            }),
            parse_mode: "Markdown"

        };
    }
    return options;
}

function parseMessage(msg, message) {
    if (message == process.env.OLLI1) {
        message = process.env.OLLI2;
    }
    message = message.replaceAll(":user:", msg.from.first_name);
    if (msg.text && msg.text.indexOf("[a]") != -1) {
        message = message.split("");
        message = message.join(" ");
    }
    return message;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


module.exports = {
    sendMessage: sendMessage,
    sendQuote: sendQuote
};

