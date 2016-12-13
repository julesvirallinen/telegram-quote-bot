var express = require('express');
var router = express.Router();

var db = require('../app/quotes');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/meemi', function (req, res, next) {
    db.Quote.find({group: process.env.IKEA}, function (err, quotes) {
        if (quotes) {
            res.render('meemi', {title: 'Express', quotes: quotes});
        }
    });


});


module.exports = router;
