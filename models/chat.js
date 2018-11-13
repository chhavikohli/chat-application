var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatSchema = new Schema({
    message: String,
    senderid: String,
    receiverid: String,
    roomId:String,
    file:String,
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far

// we need to create a model using it
var Chat = mongoose.model('Chat', chatSchema);

// make this available to our users in our Node applications
module.exports = Chat;