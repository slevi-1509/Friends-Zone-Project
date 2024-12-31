const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');
const messageModel = require('../models/messageModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAllUsers = async() => {
    try {
        let allUsers = await userModel.find({});
        if (allUsers.length > 0) {
            return allUsers;
        } else {
            return "No users found!"
        }
    } catch (error) {
        return "Error while trying to get all users!" + error.message;
    }
}

const getMyFriends = async(username) => {
    try {
        let allUsers = await userModel.aggregate([{ $match: { 'AllFriends': username } }]);
        return allUsers;
    } catch (error) {
        return "Error while trying to get all friends!" + error.message;
    }
}

const createNewMessage = async (data) => {
    try {
        let newPost =  new messageModel(data);
        await newPost.save();
        return "New message created successfully!";
    } catch (error) {
        return "Message was not created! " + error.message;
    }
}

const getMyMessages = async(username) => {   
    try {
        let myMessages = await messageModel.find({$or:[{sendName: username},{recvName: username}]});
        return myMessages;
    } catch (error) {
        return "Error while trying to get all messages!" + error.message;
    }  
};

const getUserMessages = async(username) => {   
    try {
        let myMessages = await messageModel.find({$or:[{sendName: username},{recvName: username}]});
        return myMessages;
    } catch (error) {
        return "Error while trying to get all messages!" + error.message;
    }  
};

const updateRequest = async(username, data) => {
    try {
        let user = await userModel.findOneAndUpdate({username: username}, { $push: data });
        if (user) {
            return "User updated successfully";
        } else {
            return "No User found with that ID";
        }
    } catch (error) {
        return (error.message);
    }
    
};

const deleteFRO_FRI = async(username, data) => {
    try {
        await userModel.findOneAndUpdate({username: username}, { $pull: data });
        return (username, "User updated successfully");
    } catch (error) {
        return (error.message);
    }
};

const approveFriends = async(username, data) => {
    let FRO_FRI;
    if (data.FRO){
        FRO_FRI = data.FRO;
    } else {
        FRO_FRI = data.FRI;
    }
    try {
        await userModel.findOne({username: username}).then((user) => {
            if (!user.AllFriends.includes(FRO_FRI)) {
                return "Duplicate friend record";
            }
        });
        await userModel.findOneAndUpdate({username: username}, { $push: { AllFriends: FRO_FRI }});
        return (username, "User updated successfully");
    } catch (error) {
        return (error.message);
    }
};

const getUserById = async(id) => {
    try{
        let user = await userModel.findById(id);
        if (user) {
            return user;
        } else {
            return "No User found with that ID";
        }
    } catch (error) {
        return "Error! " + error.message + ": " + id;
    }  
};

const updateUser = async(id, data) => {
    try {
        if (data.password){
            let encryptPassword = await bcrypt.hash(data.password, 12);
            data.password = encryptPassword;
        }
        let user = await userModel.findByIdAndUpdate(id, data);
        if (user) {
            return "User updated successfully!";
        } else {
            return "No User found with that ID!";
        }
    } catch (error) {
        return (error.message);
    }
    
};

const deleteUser = async(id) => {
    try {
        let user = await userModel.findByIdAndDelete(id);
        let role = await roleModel.findOneAndDelete({ user_id: id });
        if (user) {
            return "User deleted successfully!";
        } else {
            return "No User found with that ID!";
        }
    } catch (error) {
        return "Error deleting user! " + error.message;    
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

module.exports = {
    getAllUsers,
    updateRequest,
    getUserById,
    deleteFRO_FRI,
    getMyFriends,
    approveFriends,
    updateUser,
    deleteUser,
    createNewMessage,
    getMyMessages,
    getUserMessages,
    importMsg,
};

