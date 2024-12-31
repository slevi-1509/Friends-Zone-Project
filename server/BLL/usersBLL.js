const usersDal = require('../DAL/usersDAL');
require("dotenv").config();

const getAllUsers = async() => {
    return usersDal.getAllUsers();
}

const getMyFriends = async(username) => {
    return usersDal.getMyFriends(username);
}

const createNewMessage = async (data) => {
    return usersDal.createNewMessage(data);
}

const getMyMessages = async(username) => {   
    return usersDal.getMyMessages(username);
};

const getUserMessages = async(username) => {  
    return usersDal.getUserMessages(username); 
};

const updateRequest = async(username, data) => {
    return usersDal.updateRequest(username, data);
}

const deleteFRO_FRI = async(username, data) => {
    return usersDal.deleteFRO_FRI(username, data);
};

const approveFriends = async(username, data) => {
    return usersDal.approveFriends(username, data);
};

const getUserById = async(id) => {
    return usersDal.getUserById(id);
};

const updateUser = async(id, data) => {
    return usersDal.updateUser(id, data);
};

const deleteUser = async(id) => {
    return usersDal.deleteUser(id);
};

const importMsg = async (messages) => {
    return usersDal.importMsg(messages);
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

