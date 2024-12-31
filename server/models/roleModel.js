const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
        unique: true,
    },
    role_id: {
        type: String,
        enum: ["Admin", "Programmer", "User"],
        default: "User", 
        required: true,
    },
} , 
    {
        versionKey: false
    });
const roleModel = mongoose.model('role', roleSchema, 'roles');

module.exports = roleModel;