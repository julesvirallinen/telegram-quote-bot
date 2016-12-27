var db = require('./schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('./config');

var moment = require('moment');
moment().format();



function sendMessage(msg, message){
    var options = {
        parse_mode: "Markdown"
    };

    bot.sendMessage(msg.chat.id, parseMessage(msg, message), options);
}

function sendQuote(msg, quote, message){
    if(message){
        quoteSender(msg, message + quote.quote);
        return;
    }
    quoteSender(msg, quote.quote, quote._id);
}

function quoteSender(msg, message, quoteId) {
    var chatId = msg.chat.id;
    if (message.length > 7 && message.substr(0, 5) == 'sti!:') {
        console.log(message)
        var stickerId = message.split(':')[1].split('(')[0];

        try {
            console.log(stickerId)
            bot.sendSticker(chatId, stickerId);
        } catch (err) {
            console.log("invalid sticker syntax " + err)

    }
        return;
    }

    var options = {
        parse_mode: "Markdown"
    };

    message = parseMessage(msg, message);

    if (quoteId) {
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
        bot.sendMessage(chatId, message, options);
        return;
    }



    bot.sendMessage(chatId, message, options);


}

function parseMessage(msg, message){
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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



module.exports = {
    sendMessage: sendMessage,
    sendQuote: sendQuote
};

