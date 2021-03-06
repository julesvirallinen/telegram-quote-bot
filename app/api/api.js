require('dotenv').config();
var express = require('express');
var app = express();

var db = require('../schemas');
var config = require('../config');

app.get("/api/:chatId/stats", (req, res) => {
    if (!req.params.chatId) {
        res.status(400).json({ error: 'Missing chat ID' });
        return;
    }

    db.Group.findOne({ chatId: req.params.chatId }, (err, arr) => {
        if (err) {
            console.error("shit brok", err);
            res.status(500).json({ error: 'shit brok' });
            return;
        }

        db.Quote.count({ group: arr._id }, (err, count) => {
            res.status(200).json({
                data: {
                    quotes_requested: arr.counts.requests,
                    quotes_returned: arr.counts.returned,
                    quotes_saved: count
                }
            });
        });
    });
});

app.all('/api/*', (req, res, next) => {
    res.status(404).json({ error: 'not found' });
});

if (config.api.enabled) {
    app.listen(config.api.port);
}