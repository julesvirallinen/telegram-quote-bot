require('dotenv').config();

var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URL || 'mongodb://localhost/quotes';
mongoose.Promise = global.Promise;
mongoose.connect(url);

mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});

process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    console.error(err.stack)
    process.exit(1)
})




require('./app/bot/commandController');
require('./app/api/api');
// require('./app/service/timeService');



process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});


