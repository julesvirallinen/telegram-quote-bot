/**
 * Created by julkku on 12/25/16.
 */
var botOutput = require('../botOutput');

function roll(msg, match){
    var input = match[4];
    if(!isNaN(match[4])){
        if (input > 0){
            botOutput.sendMessage(msg, randomIntFromInterval(1, input));
        }
    } else {
        botOutput.sendMessage(msg, randomIntFromInterval(1, 10000000));
    }

}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    roll: roll
}
