const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:String,
    password:String,
    email:String,
    createdAt:String
});

module.exports = mongoose.model('users', userSchema);