module.exports = function (bot) {
    var quoteService = require('./quoteService');



    bot.onText(/\/start/, function (msg, match) {
        quoteService.start(msg);
    });

    bot.onText(/\/(sleep(\@puppy2_bot)?)/, function (msg, match) {
        quoteService.sleep(msg);
    });

    bot.onText(/\/(quote(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
        quoteService.quote(msg, match);
    });

    bot.onText(/\/(imfeelinglucky(\@puppy2_bot)?)/, function (msg, match) {
        quoteService.imfeelinglucky(msg);
    });

    bot.onText(/^\/(add(\@puppy2_bot)?)( (.+)|\0{0})/, function (msg, match) {
        quoteService.add(msg, match);
    });


    bot.onText(/\/(findquotes(\@puppy2_bot)?) (.+)/, function (msg, match) {
        quoteService.findQuote(msg, match);
    });

        bot.onText(/\/(delquote(\@puppy2_bot)?) (.+)/, function (msg, match) {
        quoteService.delQuote(msg, match);
    });

    



    bot.on('callback_query', function onCallbackQuery(callbackQuery) {
        quoteService.voteCallback(callbackQuery);
    });



};

