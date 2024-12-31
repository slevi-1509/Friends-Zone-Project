const messagesDAL = require('../DAL/messagesDAL');

const createNewMessage = (data) => {
    return messagesDAL.createNewMessage(data);
}

const getMyMessages = (username, room) => {   
    return messagesDAL.getMyMessages(username, room);
};

const getRoomMessages = (room) => {   
    return messagesDAL.getRoomMessages(room);
};

const importMsg = (messages) => {
    return messagesDAL.importMsg(messages);
};

const deleteRoom = (room) => {
    return messagesDAL.deleteRoom(room);
};

module.exports = {
    createNewMessage,
    getMyMessages,
    getRoomMessages,
    importMsg,
    deleteRoom
};

