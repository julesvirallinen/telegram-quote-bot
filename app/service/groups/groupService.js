/**
 * Created by julkku on 12/27/16.
 */
var db = require('./../../schemas');
require('dotenv').config();
var config = require('../../config');
var botOutput = require('../../bot/botOutput');




function start(msg) {
    var chatId = msg.chat.id;

    db.Group.findOne({chatId: chatId}, function (err, group) {
        if (!group) {

            addGroup(chatId);
            return;
        }

        botOutput.sendMessage(msg, "Group already exists! :)");
    });

}


function addGroup(msg) {
    var chatId = msg.chat.id;

    // console.log(msg);

    var newGroup = db.Group({
        chatId: chatId,
        lastQuote: 0
    });
    newGroup.save(function (err) {
        if (err) throw err;
        botOutput.sendMessage(msg, "Group successfully added! :)");


    });
}


function stats(msg) {
    var chatId = msg.chat.id;
    console.log("made it to stats!")



    db.Group.findOne({chatId: chatId}, function (err, arr) {
        var d = new Date();
        if (d.getTime() - arr.lastQuote < config.spamSec * 1000) {
            console.log("Spam block! Time left: " + (-(d.getTime() - arr.lastQuote) / 1000));
            return;
        }
        db.Quote.count({group:arr._id}, function( err, count){
            botOutput.sendMessage(msg, "Quotes requested: " + arr.counts.requests + ". Quotes returned: " + arr.counts.returned +
                ". Quotes saved: " + count);
        })

    });

}

module.exports = {
    start: start,
    stats: stats
};

