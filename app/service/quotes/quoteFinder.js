var db = require('./../../schemas');
var TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
var bot = new TelegramBot(process.env.API_TOKEN);
var config = require('../../config');
var botOutput = require('../../botOutput');



function sleep(msg) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, arr) {
        var d = new Date();
        if (d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Already asleep! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
            return;
        }

        arr.lastQuote = d.getTime() + config.sleepTime * 1000;

        arr.save(function (err) {
            if (err) throw err;
            console.log("sleeping for 200 seconds");
            bot.sendMessage(msg.chat.id, "ok, ,___, ");

        });
    });

}

function quote(msg, match) {
    var chatId = msg.chat.id;
    db.Group.findOne({chatId: chatId}, function (err, arr) {
        if (!arr) {
            console.log(" quoteservice / quote(): no groups matched, terminating.")
            return;
        }

        if (!arr.counts || !arr.counts.returned) {
            arr.counts.returned = 0;
            arr.counts.requests = 0;
        }

        var d = new Date();
        if (msg.from.id != process.env.JULIUS && d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Blocked for spam! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
        } else {

            //sometimes sends quote from entire pool of quotes. 
            if (match[4] == undefined) {
                if (Math.random() < 0.005) {
                    sentTotallyRandom(msg);
                    return;
                }

                getQuoteForGroup(msg, arr._id, '.');

            } else {

                console.log("searching for: " + match[4]);
                getQuoteForGroup(msg, arr._id, match[4]);
            }

            // Sets time for previous quote and saves group. 
            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;

            arr.counts.returned++;

        }

        arr.counts.requests++;
        arr.save(function (err) {
            if (err) throw err;
            // console.log('!');
        });

    });

}

function imFeelingLucky(msg) {
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
        } else {
            sentTotallyRandom(msg);

            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;
            // arr.counts.returned = 1;

        }
        // arr.counts.requests = 1;
        arr.save(function (err) {
            if (err) throw err;
            // console.log('!');
        });

    });

}


function voteCallback(callbackQuery) {
    //this seems to be missing a row or two... i'll have to find it...
    var parts = callbackQuery.data.split('|');
    if (parts[0] == '+' || parts[0] == '-') {
        db.Quote.findById(parts[1], function (err, quote) {
            if (quote.votes) {
                if (parts[0] == '+') quote.votes.upVotes++;
                if (parts[0] == '-') quote.votes.downVotes++;

                quote.save(function (err, quote) {
                    if (err) throw err;
                    console.log(quote.votes);
                });
                // bot.answerCallbackQuery(callbackQuery.id, ":D");
             }
        });


    }
    var options = {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id
    };
    bot.editMessageText(callbackQuery.message.text, options);


}


function escape(text) {
    return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
}

function getQuoteForGroup(msg, group_id, search) {
    search = search.replace(/\[a\]/g, "").trim();

    var re = new RegExp(escape(search.trim()), "i");

    db.Quote.findRandom({group: group_id, quote: re}, function (err, quote) {
        if (quote[0]) {
            botOutput.sendQuote(msg, quote[0]);
        } else {
            getQuoteForGroup(msg, group_id, '.');
            // I hope this never loops and kills everything...
        }
    });
}


function sentTotallyRandom(msg) {
    var chatId = msg.chat.id;

    db.Quote.findRandom(function (err, quote) {
        if (quote[0]) {
            botOutput.sendQuote(msg, quote[0]);
        }
    });

}




module.exports = {
    quote: quote,
    imFeelingLucky: imFeelingLucky,
    voteCallback: voteCallback,
}


