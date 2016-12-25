var db = require('./schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('../config');


function sendMessage(msg, message){
    bot.sendMessage(msg.chat.id, message);
}



module.exports = {
    sendMessage: sendMessage
};

