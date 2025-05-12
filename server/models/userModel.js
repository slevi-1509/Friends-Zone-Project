const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    address: {type: String, required: true},
    role_name: {type: String, required: true},
    gender: {
        type: String,
        enum: ["Male", "Female", "LGBTQ"],
        required: true,
    },
    age: {type: Number, required: true},
    email: {type: String, required: true},
    imageURL: {type: String},
    password: {type: String, required: true},
    actionsLeft: {type: Number, required: true},
    lastActionTime: {type: Date},
    FRI: {type: Array},
    FRO: {type: Array},
    AllFriends: {type: Array}
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema, 'users');

module.exports = userModel;
