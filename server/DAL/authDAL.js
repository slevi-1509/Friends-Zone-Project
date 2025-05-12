const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');
require("dotenv").config();

const registerNewUser = async (userData)=>{
    const newUser = new userModel(userData);
    const roleData = new roleModel({ user_id: newUser._id, role_id: newUser.role_name });
    try {
        await newUser.save(); 
        await roleData.save();
        return "New user created successfully";
    } catch (error) {
        return "Error creating new user! " + error.message;
    }
};

const logInUser = async (userData)=>{
    try {
        let user = await userModel.findOne({ username: userData.username });
        // console.log(user);
        if (user) {
            let isValidPass = await bcrypt.compare(userData.password, user.password);
            if (isValidPass) {
                try {
                    let token = jwt.sign({
                        username: user.username,
                        userId: user._id
                    }, process.env.SECRET_KEY,
                    { expiresIn: "10h" });
                    return {user, token};
                } catch (error) {
                    return "Error while creating token!";
                }
            } else {
                return "Invalid Password!";
            };
        } else {
            return "User not found!";
        }
    } catch (error) {
        return "Error while signing user!";
    }
}

const importUsers = async (users)=>{
    for (let user of users) {
        if (user.role_name == "Admin"){
            try {
                let roleCheck = await userModel.findOne({ role_name: "Admin" });
                if (roleCheck) {
                    return "Admin exist";
                }
            } catch (error) {
                return "Error checking admin role!";  
            }
        }
        let {password} = user;
        let encryptPassword = await bcrypt.hash(password, 12);
        user.password = encryptPassword;
        user.actionsLeft = 100;
        user.lastActionTime = Date.now();
        const newUser = new userModel(user);
        const roleData = new roleModel({ user_id: newUser._id, role_id: newUser.role_name });
        try {
            await newUser.save(); 
            await roleData.save();
        } catch (error) {
            return "Error importing users! " + error.message;
        }
    }
    return "import users successfully";
};

module.exports = {
    registerNewUser,
    logInUser,
    importUsers
};