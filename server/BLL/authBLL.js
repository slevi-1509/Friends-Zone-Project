const authDal = require('../DAL/authDAL');
require("dotenv").config();

const registerNewUser = async (userData) => {
    return authDal.registerNewUser(userData);
};

const importUsers = async (users) => {
    return authDal.importUsers(users);
};

const logInUser = async (userData)  => {
    return authDal.logInUser(userData);
};

module.exports = {
    registerNewUser,
    logInUser,
    importUsers,
};