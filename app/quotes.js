/**
 * Created by julkku on 12/11/16.
 */
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var Schema = mongoose.Schema;

var quotesSchema = new Schema({
    quote: String,
    index: Number,
    // addedBy: {type: Schema.ObjectId, ref: 'User'},
    group: {
        type: Schema.ObjectId, ref: 'Group',
    },
    rating: {type: Number, default: 1}

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
    }
});

// var userSchema = new Schema({
//     userId: {type: String, unique: true},
//     name: String,
//     lastQuote: Number,
//     quotesAdded: Number,
//     banned: Boolean
// })

// quotesSchema.index({ quote: 1});
quotesSchema.plugin(random);

var Quote = mongoose.model('Quote', quotesSchema),
    // User = mongoose.model('User', userSchema),
    Group = mongoose.model('Group', groupsSchema);

module.exports.Quote = Quote;
// module.exports.User = User;
module.exports.Group = Group;
