const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    picture: String,
    status:String,
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far

// we need to create a models using it
const User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;