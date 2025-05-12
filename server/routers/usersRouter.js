const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const router = express.Router();
const validateToken = require('../utils/validateToken');

router.get('/', validateToken, async (req, res) => {
    let response = await usersBLL.getAllUsers();
    // console.log(response)
    res.send(response);
});

router.get('/:username/myfriends', validateToken, async (req, res) => {
    let { username } = req.params;
    let response = await usersBLL.getMyFriends(username);
    res.send(response);
});

router.get('/:id', validateToken, async (req, res) => {
    let { id } = req.params;
    let response = await usersBLL.getUserById(id);
    res.send(response);
});

router.post('/:id/actions', validateToken, async (req, res) => {
    let { id } = req.params;
    let actionData = req.body;
    let response = await usersBLL.updateActions(id, actionData);
    res.send(response);
});

router.put('/:id', validateToken, async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let response = await usersBLL.updateUser(id, data);
    res.send(response);
});

router.put('/:id/frrequest', validateToken, async (req, res) => {
    console.log("1", req.params, req.body);
    let { id } = req.params;
    let data = req.body;
    let response = await usersBLL.frrequest(id, data);
    res.send(response);
});

router.put('/:id/frdelete', validateToken, async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let response = await usersBLL.frdelete(id, data);
    res.send(response);
});

router.put('/:id/frapprove', validateToken, async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let response = await usersBLL.frapprove(id, data);
    res.send(response);
});

router.delete('/:id', validateToken, async (req, res) => {
    let { id } = req.params;
    let response = await usersBLL.deleteUser(id);
    res.send(response);
});

module.exports = router;


