const express = require('express');
const messagesBLL = require('../BLL/messagesBLL');
const router = express.Router();
const validateToken = require('../utils/validateToken');

router.get('/:username', validateToken, async (req, res) => {
    let { username } = req.params;
    let response = await messagesBLL.getMyMessages(username);
    console.log("get", response)
    res.send(response);
});

router.post('/new', validateToken, async (req, res) => {
    let message = req.body;
    let response = await messagesBLL.createNewMessage(message);
    res.send(response);
});

router.post('/import', async (req, res) => {
    let messages = req.body;
    let response = await messagesBLL.importMsg(messages);
    res.send(response);
});

module.exports = router;


