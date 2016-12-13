/**
 * Created by julkku on 12/11/16.
 */

module.exports = function (bot) {
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
            if (!group) {
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

    bot.onText(/\/(add(\@puppy2_bot)?) (.+)/, function (msg, match) {
        var chatId = msg.chat.id;
        console.log(match)
        addToGroup(msg.from.id, chatId, match[3]);
    });

    // bot.onText(/\/addquote (.+)/, function (msg, match) {
    //     // addGroup(process.env.IKEA);
    //     console.log("message to ikea", match[1])
    //     addToGroup(-1, process.env.IKEA, match[1]);
    // });

    function escape(text) {
        return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
    };

    function quoteFromGroup(chatId, group_id, search) {
        var re = new RegExp(escape(search.trim()), "i");
        console.log("regex ", re)

        db.Quote.findRandom({group: group_id, quote: re}, function (err, quote) {
            console.log(quote);
            if (quote[0]) {
                bot.sendMessage(chatId, quote[0].quote);
            } else {
                quoteFromGroup(chatId, group_id, '.');
            }
        });


    };

    bot.onText(/\/(sleep(\@puppy2_bot)?)/, function (msg, match) {
        var chatId = msg.chat.id;

        db.Group.findOne({chatId: chatId}, function (err, arr) {
            var d = new Date();
            if (d.getTime() - arr.lastQuote < 20000) {
                console.log("Already asleep! Time left: " + (-(d.getTime()-arr.lastQuote)/1000));
                return;
            }
                arr.lastQuote = d.getTime() + 200000;
            arr.save(function (err) {
                if (err) throw err;
                console.log("sleeping for 200 seconds");
                bot.sendMessage(msg.chat.id, "ok, ,___, ");

            });
        });
    });


bot.onText(/\/(quote(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, arr) {


        var d = new Date();
        if (d.getTime() - arr.lastQuote < 20000) {
            console.log("Blocked for spam! Time left: " + (-(d.getTime()-arr.lastQuote)/1000));
            return;
            if (arr.lastRequestBy == msg.from.id && msg.chat.type != 'private') {
                console.log("blocked for spam from person");
                return;
            }
        }

        if (match[4] == undefined) {
            quoteFromGroup(chatId, arr._id, '.');
        } else {
            console.log("searching for: " + match[4])
            quoteFromGroup(chatId, arr._id, match[4]);
        }

        arr.lastQuote = d.getTime();
        arr.lastRequestBy = msg.from.id;
        arr.save(function (err) {
            if (err) throw err;
            // console.log('!');
        });
    });
});

}
;

