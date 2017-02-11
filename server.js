require('dotenv').config();

var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URL || 'mongodb://localhost/quotes';
mongoose.Promise = global.Promise;
mongoose.connect(url);

process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    console.error(err.stack)
    process.exit(1)
})




require('./app/bot/commandController');
// require('./app/service/timeService');



