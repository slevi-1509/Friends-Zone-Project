const express = require('express');
const postsBLL = require('../BLL/postsBLL');
const router = express.Router();
const validateToken = require('../utils/validateToken');

router.get('/', validateToken, async (req, res) => {
    let sortBy = req.query['sortBy'];
    let asc = req.query['asc'];
    let response = await postsBLL.getAllPosts(sortBy, asc);
    res.send(response);
});

router.get('/search', validateToken, async (req, res) => {
    const { srchField, compSelect, srchText, sortBy, asc } = req.query;
    let response = await postsBLL.getPostsBySearch("", srchField, compSelect, srchText, sortBy, asc);
    res.send(response);
});

router.get('/:username', validateToken, async (req, res) => {
    let { username } = req.params;
    let sortBy = req.query['sortBy'];
    let asc = req.query['asc'];
    let response = await postsBLL.getPostsByUserName(username, sortBy, asc);
    res.send(response);
});

router.get('/:username/search', validateToken, async (req, res) => {
    let { username } = req.params;
    const { srchField, compSelect, srchText, sortBy, asc } = req.query;
    let response = await postsBLL.getPostsBySearch(username, srchField, compSelect, srchText, sortBy, asc);
    res.send(response);
});

router.get('/:username/openaipost', validateToken, async (req, res) => {
    let { username } = req.params;
    const { subject } = req.query;
    let response = await postsBLL.getOpenAiPost(username, subject);
    res.send(response);
});

router.post('/', validateToken, async (req, res) => {
    let postData = req.body;
    // console.log(postData);
    let response = await postsBLL.createNewPost(postData);
    res.send(response);
});

router.post('/import', async (req, res) => {
    let posts = req.body;
    let response = await postsBLL.importPosts(posts);
    res.send(response);
});

router.put('/:id', validateToken, async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let response = await postsBLL.updatePost(id, data);
    res.send(response);
});

router.delete('/:id', validateToken, async (req, res) => {
    let { id } = req.params;
    let response = await postsBLL.deletePost(id);
    res.send(response);
});

module.exports = router;


