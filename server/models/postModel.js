const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    "username": {
        type: String, 
        ref: 'user',
        required: true,
    },
    "title": {type: String, required: true},
    "body":  {type: String, required: true},
    "date":  {type: Date, required: true},
    "imageURL": {type: String},
    "reply": [{
        "username": {type: String},
        "body": {type: String},
        "date": {type: Date}
    }]
    }, 
    {
        versionKey: false,
        timestamps: true
    }
);
postModel = mongoose.model('post', postSchema, 'posts');

module.exports = postModel