require('dotenv').config();

var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URL || 'mongodb://localhost/quotes';
mongoose.connect(url);


require('./app/bot/commandController');
// require('./app/service/timeService');



