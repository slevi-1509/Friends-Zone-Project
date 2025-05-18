const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');
const bcrypt = require("bcrypt");
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

const getMyFriends = async(username) => {
    try {
        let allUsers = await userModel.aggregate([{ $match: { 'AllFriends': username } }]);
        return allUsers;
    } catch (error) {
        return "Error while trying to get all friends!" + error.message;
    }
}

const frrequest = async(id, data) => {
    try {
        await userModel.findByIdAndUpdate(id, { $push: {FRO: data.rcv} });
        await userModel.findByIdAndUpdate(data.rcv, { $push: {FRI: id} });
        return await getAllUsers();
    } catch (error) {
        return (error.message);
    }
};

const frdelete = async(id, data) => {
    try {
        await userModel.findByIdAndUpdate(id, { $pull: {FRI: data.snd} });
        await userModel.findByIdAndUpdate(data.snd, { $pull: {FRO: id} });
        return await getAllUsers();
    } catch (error) {
        return (error.message);
    }
};

const frapprove = async(id, data) => {
    try {
        await userModel.findByIdAndUpdate(id, { $push: { AllFriends: data.snd }, $pull: { FRI: data.snd } });
        await userModel.findByIdAndUpdate(data.snd, { $push: { AllFriends: id }, $pull: { FRO: id } });
        return await getAllUsers();
    } catch (error) {
        return (error.message);
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
            return await getAllUsers();
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

module.exports = {
    getAllUsers,
    getUserById,
    getMyFriends,
    frrequest,
    frdelete,
    frapprove,    
    updateUser,
    deleteUser,
};

