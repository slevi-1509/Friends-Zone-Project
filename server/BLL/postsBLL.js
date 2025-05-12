const postModel = require('../models/postModel');
const postsDal = require('../DAL/postsDAL');
let lastAction;
// const updateActions = require('../utils/updateActions');

const createNewPost = (data) => {
    return postsDal.createNewPost(data);
}

const importPosts = (posts) => {
    return postsDal.importPosts(posts);
}

const getAllPosts = (sortBy, asc) => {
    return postsDal.getAllPosts(sortBy, asc);
}

const getOpenAiPost = (username, subject) => {
    return postsDal.getOpenAiPost(username, subject);
}

const getPostsByUserId = (id, sortBy, asc) => {
    return postsDal.getPostsByUserId(id, sortBy, asc);
}

const getPostsByUserName = (username, sortBy, asc) => {
    return postsDal.getPostsByUserName(username, sortBy, asc);
}

const getPostsBySearch = (username, srchField, compSelect, srchText, sortBy, asc) => {
    return postsDal.getPostsBySearch(username, srchField, compSelect, srchText, sortBy, asc);  
}

const deletePost = (id) => {
    return postsDal.deletePost(id);
}

const updatePost = (id, data) => {
    return postsDal.updatePost(id, data);
}

module.exports = {
    createNewPost,
    getAllPosts,
    getOpenAiPost,
    deletePost,
    getPostsByUserId,
    getPostsByUserName,
    updatePost,
    getPostsBySearch,
    importPosts
}

