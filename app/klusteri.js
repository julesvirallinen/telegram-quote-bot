/**
 * Created by julkku on 12/21/16.
 */
require('dotenv').config();
var request = require('request');

function getSongs() {
    var d = new Date();
    var time = d.getTime();

    // console.log(time)

    request('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + process.env.KLUSTERI +
        '&api_key=' + process.env.LASTFM + '&format=json&limit=5', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info.recenttracks.track[0]['@attr'].nowplaying);
            if (info.recenttracks.track[0]['@attr'].nowplaying) {
                // console.log("joo???");
                return false;
            }
        }
    })
    return false;
}
function getAnswer() {
    getSongs(function(res) {
        console.log(res);
    })
    return "lol"
}


module.exports = getAnswer;