var TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
var http = require('http');
var https = require('https');
var cron = require('node-cron');
var fs = require('fs');


// replace the value below with the Telegram token you receive from @BotFather
var token = process.env.API_TOKEN

var bot = new TelegramBot(token, {polling: true});

require('./app/commands')(bot);
