const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');

const validateToken = async (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        res.send('No token provided.');
    } else {
        let response;
        try {
            jwt.verify(token, process.env.SECRET_KEY);
            let { username } = req.query
            if (req.method == "GET") {
                response = await updateCounter(username);
            }
            if (response == "noActions") {
                throw new Error ("No Actions left. Login back tomorrow!");
            }
            next();
        } catch (error) {
            res.send (error.message.replace("jwt", "Token"));
        }
    } 
   
};

const updateCounter = async (username) => {
    try{
        let user = await userModel.findOne({ username: username });
        let currTime = Date.now();
        let actionTime = Date(user.lastActionTime);
        let updatedCounter = user.actionsLeft;
        if (currTime != actionTime){
            if (user.actionsLeft < 10){
                updatedCounter = user.actionsLeft + 10;
            } 
        }
        if (user.actionsLeft < 1) {
            throw new Error ("noActions");
        }
        await userModel.findOneAndUpdate({ username: username }, {lastActionTime: Date.now(),  actionsLeft: updatedCounter-1});
    } catch (error) {
        return error.message;
    }  
}

module.exports = validateToken