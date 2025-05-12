const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
        unique: true,
    },
    username: {type: String, required: true},
    action: {type: String, required: true},
    document_Id: {type: String, required: true},
    time: {type: Date, required: true},
    actionsLeft: {type: Number, required: true},
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const actionModel = mongoose.model('action', actionSchema, 'actions');

module.exports = actionModel;
