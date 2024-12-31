const postModel = require('../models/postModel');
require("dotenv").config();

const getAllPosts = async(sortBy, asc) => {
    try{
        let posts = await postModel.find({});
        if (posts.length > 0) {
            lastAction = "Get all posts"
            return posts;
        } else {
            lastAction = "Get all posts - No posts found"
            return lastAction;
        }
    } catch (error) {
        lastAction = "Error getting all posts: " + error.message;
        return lastAction;
    }
}

const createNewPost = async (data)=>{
    try {
        let newPost =  new postModel(data);
        await newPost.save();
        lastAction = "New post created successfully!"
    } catch (error) {
        lastAction = "Error creating new post: " + error.message;
    }
    return lastAction;
};

const importPosts = async (posts)=>{
    try {
        const options = { ordered: true };
        const result = await postModel.insertMany(posts, options);
        lastAction = "Import posts successfully!"
    } catch (error) {
        lastAction = "Error importing posts!";
    }
    return lastAction;
}

const getPostsByUserId = async (id, sortBy, asc)=>{
    try{
        let posts = await postModel.find({userId: id}).sort({[sortBy]: Number(asc)});;
        if (posts.length > 0) {
            return posts;
        } else {
            return "No Posts found!"
        }
    } catch (error) {
        return "Error getting posts! " + error.message;
    }  
};

const getPostsByUserName = async (username, sortBy, asc)=>{
    try{
        let posts = await postModel.find({username: username}).sort({[sortBy]: Number(asc)});;
        if (posts.length > 0) {
            lastAction = "Get posts by username"
            return posts;
        } else {
            lastAction = "Get posts by username - No posts found"
            return lastAction;
        }
    } catch (error) {
        lastAction = "Error getting posts by username: " + error.message;
        return lastAction;
    }  
};

const getPostsBySearch = async (username, srchField, compSelect, srchText, sortBy, asc)=>{
    let srchParams = {};
    switch(srchField) {
        case "username":
            srchParams = {username: { $regex: srchText, $options:'i' }}
            break;
        case "title":
            srchParams = {title: { $regex: srchText, $options:'i' }}
            break;
        case "director":
            srchParams = {director: { $regex: srchText, $options:'i' }}
            break;
        case "airDate":
            if (compSelect == '>') {
                srchParams = {airDate: { $gte: new Date(srchText).toDateString() }}  
            } else {
                srchParams = {airDate: { $lte: new Date(srchText).toDateString() }}
            }
            break;
        case "length":
            if (compSelect == '>') {
                srchParams = {length: { $gt: Number(srchText) }}
            } else {
                srchParams = {length: { $lt: Number(srchText) }}
            }
            break;
        default:
            srchParams = {title: { $regex: srchText, $options:'i' }}
      }
    try{
        if (username != ""){
            srchParams.username = username;
        }
        let posts = await postModel.find(srchParams).sort({[sortBy]: Number(asc)});
        if (posts.length > 0) {
            lastAction = "Get posts by search"
            return posts;
        } else {
            lastAction = "Get posts by search - No posts found"
            return lastAction;
        }
    } catch (error) {
        lastAction = "Error getting posts by search: " + error.message
        return lastAction;
    }  
};

const deletePost = async (id)=>{
    try {
        let post = await postModel.findByIdAndDelete(id);
        if (post) {
            lastAction = "Post deleted successfully!"
        } else {
            lastAction = "Deleting post - Post not found"
        }
    } catch (error) {
        lastAction = "Error deleting post: " + error.message
    }
    return lastAction;
};

const updatePost = async (id, data)=>{
    try {
        let post = await postModel.findByIdAndUpdate(id, { $push: { reply: data } })
        if (post) {
            lastAction = "Post updated successfully!";
        } else {
            lastAction = "Updating post - Post not found"
        }
    } catch (error) {
        lastAction = "Error updating post: " + error.message
    }
    return lastAction;
};

module.exports = {
    createNewPost,
    getAllPosts,
    deletePost,
    getPostsByUserId,
    getPostsByUserName,
    updatePost,
    getPostsBySearch,
    importPosts
};