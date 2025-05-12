const usersDal = require('../DAL/usersDAL');
require("dotenv").config();

const getAllUsers = () => {
    return usersDal.getAllUsers();
}

const getMyFriends = (username) => {
    return usersDal.getMyFriends(username);
}

const createNewMessage = (data) => {
    return usersDal.createNewMessage(data);
}

const getMyMessages = (username) => {   
    return usersDal.getMyMessages(username);
};

const getUserMessages = (username) => {  
    return usersDal.getUserMessages(username); 
};

const frrequest = (id, data) => {
    return usersDal.frrequest(id, data);
}

const frdelete = (id, data) => {
    return usersDal.frdelete(id, data);
};

const frapprove = (id, data) => {
    return usersDal.frapprove(id, data);
};

const getUserById = (id) => {
    return usersDal.getUserById(id);
};

const updateUser = (id, data) => {
    return usersDal.updateUser(id, data);
};

const deleteUser = (id) => {
    return usersDal.deleteUser(id);
};

const importMsg = (messages) => {
    return usersDal.importMsg(messages);
};

module.exports = {
    getAllUsers,
    getUserById,
    getMyFriends,
    frrequest,
    frdelete,
    frapprove,
    updateUser,
    deleteUser,
    createNewMessage,
    getMyMessages,
    getUserMessages,
    importMsg,
};

