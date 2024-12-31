const messageModel = require('../models/messageModel');
require("dotenv").config();

const createNewMessage = async (data) => {
    try {
        let newMessage =  new messageModel(data);
        await newMessage.save();
        return newMessage._id;
    } catch (error) {
        return "Message was not created! " + error.message;
    }
}

const getMyMessages = async(username, room) => {   
    try {
        let myMessages = await messageModel.find({
            $and: [
                {
                    $or:[
                        {sendName: username},
                        {recvName: username}
                    ]
                },
                {
                    room: room
                }
            ]
        });
        return myMessages;
    } catch (error) {
        return "Error while trying to get all messages!" + error.message;
    }  
};

const getRoomMessages = async(room) => {   
    try {
        let messages = await messageModel.find({ room: room });
        return messages;
    } catch (error) {
        return "Error while trying to get all messages!" + error.message;
    }  
};

const importMsg = async (messages) => {
    for (let msg of messages) {
        const newMsg = new messageModel(msg);
        try {
            await newMsg.save(); 
        } catch (error) {
            return "Error importing messages! " + error.message;
        }
    }
    return "import messages successfully";
};

const deleteRoom = async (room)=>{
    try {
        let roomDeleted = await messageModel.deleteMany({ room : room });
    } catch (error) {
        return("Error deleting room: " + error.message)
    }
};

module.exports = {
    createNewMessage,
    getMyMessages,
    getRoomMessages,
    importMsg,
    deleteRoom
};

