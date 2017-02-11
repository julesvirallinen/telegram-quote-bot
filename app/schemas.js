/**
 * Created by julkku on 12/11/16.
 */
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var Schema = mongoose.Schema;

var quotesSchema = new Schema({
    quote: String,
    type: String,
    resourceId: String,
    index: Number,
    group: {
        type: Schema.ObjectId, ref: 'Group'
    },
    rating: {type: Number, default: 1},
    votes : {
        upVotes: {type:Number, default: 0},
        downVotes: {type:Number, default: 0}
    }

});

var groupsSchema = new Schema({
    chatId: {type: Number, unique: true},
    // quotes: [{type: Schema.ObjectId, ref: 'Quote'}],
    users: [{userId: String, lastQuote: Number}],
    lastQuote: {type: Number, default: 0},
    lastRequestBy: {type: Number, default: 0},
    config: {
        sleepLength: Number,
        quoteBuffer: Number
    },
    counts : {
        requests: {type: Number, default: 0},
        returned: {type: Number, default: 0}
    }
});

quotesSchema.plugin(random);

var Quote = mongoose.model('Quote', quotesSchema),
    Group = mongoose.model('Group', groupsSchema);

module.exports.Quote = Quote;
module.exports.Group = Group;
