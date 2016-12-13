/*

module.exports = function (bot) {

// var url = process.env.MONGODB;
// mongoose.connect(url);

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/quotes');

    var Quotes = require('./quotes');

    /!*
     var QUOTES_FILE = 'quotes.json';

     var quotes = [];
     var randMode = false;
     function getQuotes() {
     fs.readFile(QUOTES_FILE, (err, quotesData) = > {
     if (
     !err
     )
     {
     quotes = JSON.parse(quotesData)
     console.log('Read quotes!')
     }
     })
     ;
     }
     *!/

    bot.onText(/\/start/, function (msg, match) {
        console.log(msg);
        var chatId = msg.chat.id;

        var newGroup = Quotes({
            chatId: chatId,
            quotes: [],
            users: [],
            lastQuote: 0
        });

        newGroup.save(function(err) {
            if(err) throw err;
            bot.sendMessage(msg.chat.id, "Group or user added! :)");

        });

        // var quotes = quotesForGroup(chatId).quotes;
        // console.log(quotes);
        //
        // var randQuote = quotes[Math.floor(Math.random() * quotes.length)];
    });

    bot.onText(/\/addquote (.+)/, function (msg, match) {
        var chatId = msg.chat.id;


        var newQuote = {
            'id': amountOfQuotes(chatId) + 1,
            'quote': match[1]
        }
        quotesForGroup(chatId).quotes.push(newQuote)
        bot.sendMessage(chatId, 'added quote: ' + match[1])
        saveQuotes(quotes, getQuotes)
    });



    function saveQuotes(data) {
        console.log(quotes, JSON.stringify(quotes));
        fs.writeFile(QUOTES_FILE, JSON.stringify(quotes))
    }

    function quotesForGroup(groupId) {
        for (var k in quotes.groups) {
            console.log(quotes.groups[k].id)
            if (groupId == quotes.groups[k].id) {
                console.log('defined')
                return quotes.groups[k]
            }
        }
    }

    function amountOfQuotes(groupId) {
        var quotes = quotesForGroup(groupId)
        console.log('juuh', quotes)
        if (quotes == undefined) {
            return 0
        }
        return quotes.quotes.length
    }

    function isNumeric(num) {
        return !isNaN(num)
    }

    bot.onText(/\/randmodetoggle/, function (msg, match) {
        if (randMode) {
            randMode = false;
        }
        else {
            randMode = true;
        }
    })

    bot.onText(/\/echo (.+)/, function (msg, match) {
        chatId = msg.chat.id
        var resp = match[1]
        bot.sendMessage(chatId, resp)
    })

    function randomQuote(msg) {
        var chatId = msg.chat.id
        var quotes = quotesForGroup(chatId).quotes
        console.log(quotes)

        var randQuote = quotes[Math.floor(Math.random() * quotes.length)]
        bot.sendMessage(msg.chat.id, randQuote.quote)
    }

    bot.onText(/\/quote$| (.+)/, function (msg, match) {
        // bot.sendMessage(msg.chat.id, "if you can't handle me at my best, you don't deserve me at my worst. -Adolf Hitler. RIP puppy 9.12")
//     console.log("match, match[1]", match, match[1])
//         if(match[1]==undefined){
//             if(randMode){
//         randomQuote(msg);
//         return;
// }}
//     var chatId = msg.chat.id
//     if (isNumeric(match[1])) {
//         var quotes = quotesForGroup(chatId).quotes
//         for (var k in quotes) {
//             if (quotes[k].id == +match[1]) {
//                 bot.sendMessage(msg.chat.id, quotes[k].quote)
//             }
//         }
//     } else {
//         var quotes = quotesForGroup(chatId).quotes;
//         for (var k in quotes) {
//             var re = new RegExp(match[1], "i");

//             if (quotes[k].quote.search(re) != -1) {
//                 bot.sendMessage(msg.chat.id, quotes[k].quote)
//                 return
//             }
//         }
//     }
    })

// bot.onText(/\/quote/, function (msg, match) {

//     var chatId = msg.chat.id
//     var quotes = quotesForGroup(chatId).quotes
//     console.log(quotes)

//     var randQuote = quotes[Math.floor(Math.random() * quotes.length)]
//     bot.sendMessage(msg.chat.id, randQuote.quote)
// })

    /!*
     bot.onText(/\/addquote (.+)/, function (msg, match) {
     var chatId = msg.chat.id;


     var newQuote = {
     'id': amountOfQuotes(chatId) + 1,
     'quote': match[1]
     }
     quotesForGroup(chatId).quotes.push(newQuote)
     bot.sendMessage(chatId, 'added quote: ' + match[1])
     saveQuotes(quotes, getQuotes)
     });
     *!/

};
*/
