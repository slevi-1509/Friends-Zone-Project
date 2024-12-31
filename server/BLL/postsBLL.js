const postModel = require('../models/postModel');
const postsDal = require('../DAL/postsDAL');
let lastAction;
// const updateActions = require('../utils/updateActions');

const createNewPost = async (data) => {
    return postsDal.createNewPost(data);
}

const importPosts = async (posts) => {
    return postsDal.importPosts(posts);
}

const getAllPosts = async(sortBy, asc) => {
    return postsDal.getAllPosts(sortBy, asc);
}

const getPostsByUserId = async (id, sortBy, asc) => {
    return postsDal.getPostsByUserId(id, sortBy, asc);
}

const getPostsByUserName = async (username, sortBy, asc) => {
    return postsDal.getPostsByUserName(username, sortBy, asc);
}

const getPostsBySearch = async (username, srchField, compSelect, srchText, sortBy, asc) => {
    return postsDal.getPostsBySearch(username, srchField, compSelect, srchText, sortBy, asc);  
}

const deletePost = async(id) => {
    return postsDal.deletePost(id);
}

const updatePost = async(id, data) => {
    return postsDal.updatePost(id, data);
}

module.exports = {
    createNewPost,
    getAllPosts,
    deletePost,
    getPostsByUserId,
    getPostsByUserName,
    updatePost,
    getPostsBySearch,
    importPosts
}

