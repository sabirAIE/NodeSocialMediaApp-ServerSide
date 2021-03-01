const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    body:String,
    userName:String,
    createdAt:String,
    comments: [
        {
            body:String,
            userName:String,
            createdAt:String,
        }
    ],
    likes:[
        {
            userName:String,
            createdAt:String,
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    }

});

module.exports = mongoose.model('posts', postSchema);