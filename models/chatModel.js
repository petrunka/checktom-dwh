var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
    atricleid: { type: String, default: "bike" },
    nick: String,
    to: { type: String, default: "all" },
    msg: String,
    created: { type: Date, default: Date.now }
});
chatSchema.set('toObject',{getters: true});

/**
 * Methods
 */

mongoose.model('chat', chatSchema,'chat');