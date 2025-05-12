const authDal = require('../DAL/authDAL');
const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');
const bcrypt = require("bcrypt");
require("dotenv").config();

const registerNewUser = async (userData) => {
    if (userData.role_name === "Admin"){
        try {
            let roleCheck = await userModel.findOne({ role_name: "Admin" });
            if (roleCheck) {
                return "Admin exist";
            }
        } catch (error) {
            return "Error checking admin role!";  
        }
    }
    let {password} = userData;
    let encryptPassword = await bcrypt.hash(password, 12);
    userData.password = encryptPassword;
    return authDal.registerNewUser(userData);
};

const importUsers = (users) => {
    return authDal.importUsers(users);
};

const logInUser = (userData)  => {
    return authDal.logInUser(userData);
};

module.exports = {
    registerNewUser,
    logInUser,
    importUsers,
};