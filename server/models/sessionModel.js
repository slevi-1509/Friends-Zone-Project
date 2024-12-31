const mongoose = require('mongoose');

// const sessionSchema = new mongoose.Schema({
//     expires: {type: Date ,required: true},
//     session: {type:Array, required: true},
// } , 
//     {
//         versionKey: false
//     });
const sessionModel = mongoose.model('session', {}, 'sessions');

module.exports = sessionModel;