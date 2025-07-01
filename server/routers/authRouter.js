const express = require('express');
const authBLL = require('../BLL/authBLL');
const router = express.Router();

router.post('/register', async (req, res) => {
    let newUser = req.body;
    let response = await authBLL.registerNewUser(newUser);
    res.send(response);
});

router.post('/import', async (req, res) => {
    let users = req.body;
    let response = await authBLL.importUsers(users);
    res.send(response);
});

router.post('/login', async (req, res) => {
    let userData = req.body;
    console.log(req.body)
    let response = await authBLL.logInUser(userData);
    res.send(response);
});

module.exports = router;


