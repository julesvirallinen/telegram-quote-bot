/**
 * Created by julkku on 12/25/16.
 */
var botOutput = require('../botOutput');

function roll(msg, match){
    var input = match[4];
    var length = 8;
    if(!isNaN(match[4])){
        var output = 0;
        length = input.toString().length;
        console.log(length);
        if (input > 0){
            output = randomIntFromInterval(1, input);
        }
    } else {
        output = randomIntFromInterval(1, 99999999);
    }

    output = pad(output, length);
    botOutput.sendMessage(msg, output);

}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = {
    roll: roll
}
