const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const roomsSchema = new Schema({

   /* name: { type: String, required: true, unique: true },*/
    name:String,
    participants:[],
    picture: String,
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far

// we need to create a models using it
const room = mongoose.model('room', roomsSchema);

// make this available to our users in our Node applications
module.exports = room;