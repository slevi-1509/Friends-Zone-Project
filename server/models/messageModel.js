const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    "sendName": {type: String, required: true},
    "recvName":  {type: String},
    "room": {type: String},
    "sendDate": {type: Date, required: true},
    "body":  {type: String},
    "imageURL":  {type: String},
    "replyTo": {type: mongoose.Schema.Types.ObjectId}
    }, 
    {
        versionKey: false,
        timestamps: true
    }
);

const messageModel = mongoose.model('message', messageSchema, 'messages');

module.exports = messageModel;
