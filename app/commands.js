/**
 * Created by julkku on 12/11/16.
 */

module.exports = function (bot) {
    var mongoose = require('mongoose');

    var url = process.env.MONGOLAB_URL || 'mongodb://localhost/quotes';
    mongoose.connect(url);

    // mongoose.connect('mongodb://localhost/quotes');

    var db = require('./quotes');


    bot.onText(/\/start/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, group) {
            if (!group) {

                addGroup(chatId);
                return;
            }

            bot.sendMessage(msg.chat.id, "Group already exists! :)");
        });

    });

    function addGroup(chatId) {

        // console.log(msg);

        var newGroup = db.Group({
            chatId: chatId,
            lastQuote: 0
        });
        newGroup.save(function (err) {
            if (err) throw err;
            bot.sendMessage(chatId, "Group or user added! :)");

        });
    }

    function addToGroup(addedBy, chatId, toAdd) {
        var groupId = 0;
        var quoteId = 0;

        db.Group.findOne({chatId: chatId}, function (err, group) {
            if(!group){
                return;
            }
            groupId = group._id;

            var newQuote = db.Quote({
                quote: toAdd,
                addedBy: addedBy,
                group: groupId
            });

            newQuote.save(function (err, quote) {
                if (quote) {
                    // quoteId = quote._id;
                    bot.sendMessage(chatId, "Saved quote: " + quote.quote);
                } else {
                    console.log(err)
                    bot.sendMessage(chatId, "lol no");

                }
            });
        })


    }

    bot.onText(/\/add (.+)/, function (msg, match) {
        var chatId = msg.chat.id;
        addToGroup(msg.from.id, chatId, match[1]);
    });

    // bot.onText(/\/addquote (.+)/, function (msg, match) {
    //     // addGroup(process.env.IKEA);
    //     console.log("message to ikea", match[1])
    //     addToGroup(-1, process.env.IKEA, match[1]);
    // });

    function escape(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    function quoteFromGroup(chatId, group_id, search) {
        var re = new RegExp(search, "i");

        db.Quote.findRandom({group: group_id, quote: re}, function (err, quote) {
            console.log(quote)
            if (quote[0]) {
                bot.sendMessage(chatId, quote[0].quote);
            }
        });


    };

    bot.onText(/\/quote($| (.+))/, function (msg, match) {
        var chatId = msg.chat.id;


        db.Group.findOne({chatId: chatId}, function (err, arr) {


            var d = new Date();
            if (Math.abs(arr.lastQuote - d.getTime()) < 10000) {
                console.log("blocked for spam!")
                return;
                if (arr.lastRequestBy == msg.from.id && msg.chat.type != 'private') {
                    console.log("blocked for spam from person");
                    return;
                }
            }

            if (match[1] == undefined) {
                quoteFromGroup(chatId, arr._id, '.');
            } else {
                console.log("searching for: " + match[1])
                quoteFromGroup(chatId, arr._id, match[1]);
            }

            arr.lastQuote = d.getTime();
            arr.lastRequestBy = msg.from.id;
            arr.save(function (err) {
                if (err) throw err;
                // console.log('!');
            });
        });
    });

};

