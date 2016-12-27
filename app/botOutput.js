var db = require('./schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('../config');

var moment = require('moment');
moment().format();



function sendMessage(msg, message){
    bot.sendMessage(msg.chat.id, message);
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

    if (message == process.env.OLLI1) {
        bot.sendMessage(chatId, process.env.OLLI2, options);
        return
    }
    message = message.replace(":user:", msg.from.first_name);
    if (msg.text && msg.text.indexOf("[a]") != -1) {
        message = message.split("");
        message = message.join(" ");
    }

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



module.exports = {
    sendMessage: sendMessage,
    sendQuote: sendQuote
};

