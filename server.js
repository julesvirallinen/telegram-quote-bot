var TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
var http = require('http');
var https = require('https');
var cron = require('node-cron');
var fs = require('fs');



var token = process.env.API_TOKEN
//this is the token for a dev bot, steal it if you want :D 
// var token = '276498674:AAGX4QCN9PDjGbcMx0iwLDr3fw8dRYNNGJg';
var bot = new TelegramBot(token, {polling: true});

var mongoose = require('mongoose');

var url = process.env.MONGOLAB_URL || 'mongodb://localhost/quotes';
mongoose.connect(url);

// mongoose.connect('mongodb://localhost/quotes');



require('./app/commands')(bot);
// require('./bin/www');

