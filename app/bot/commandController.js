require('dotenv').config();
var TelegramBot = require('node-telegram-bot-api');
var token = process.env.API_TOKEN;
var bot = new TelegramBot(token, {polling: true});

var groupService = require('./../service/groups/groupService');
var quoteFinder = require('./../service/quotes/quoteFinder');
var rollService = require('./../service/rollService');
var manageQuotes = require('./../service/quotes/manageQuotes');

bot.onText(/\/start/, function (msg, match) {
    groupService.start(msg);
});

bot.onText(/\/(stats(\@puppy2_bot)?)/, function (msg, match) {
    groupService.stats(msg);
});

// QUOTEFINDER
// ____________


bot.onText(/\/(sleep(\@puppy2_bot)?)/, function (msg, match) {
    quoteFinder.sleep(msg);
});

bot.onText(/\/(quote(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
    quoteFinder.quote(msg, match);
});

bot.onText(/((?!)|(^@puppy2_bot?( (.+)|\0{0})))/, function (msg, match) {
    quoteFinder.quote(msg, match);
});

// bot.onText(/\/(q(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
//     quoteFinder.quote(msg, match);
// });

bot.onText(/\/(imfeelinglucky(\@puppy2_bot)?)/, function (msg, match) {
    quoteFinder.imFeelingLucky(msg);
});

// QUOTEMANAGER
// ____________

bot.onText(/^\/(add(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
    manageQuotes.add(msg, match);
});


bot.onText(/\/(findquotes(\@puppy2_bot)?) (.+)/, function (msg, match) {
    manageQuotes.findQuote(msg, match);
});

bot.onText(/\/(delid(\@puppy2_bot)?) (.+)/, function (msg, match) {
    manageQuotes.delQuote(msg, match, true);
});

bot.onText(/\/(delquote(\@puppy2_bot)?) (.+)/, function (msg, match) {
    manageQuotes.delQuote(msg, match);
});


// ROLLSERVICE
// ____________




// dat regex tho
bot.onText(/\/(roll(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
    rollService.roll(msg, match);
});


// CALLBACK
// ____________


bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    quoteFinder.voteCallback(callbackQuery);
});
