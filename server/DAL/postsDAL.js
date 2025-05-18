const postModel = require('../models/postModel');
// import OpenAI from 'openai';
const { OpenAI } = require('openai');
require("dotenv").config();

const getAllPosts = async() => {
    try {
        let posts = await postModel.find({});
        if (posts.length > 0) {
            return posts;
        } else {
            return "No posts found";
        }
    } catch (error) {
        return(error.message);
    }
}

const getOpenAiPost = async(username, subject) => {
    try {
        const openai = new OpenAI({apiKey: process.env.OPENAI_KEY
            , dangerouslyAllowBrowser: true});
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {
                type: 'json_object', // specify the format
              },
              messages: [
                { role: "user", content: "post on subject" + subject + ", with title and body. body with at maximum 300 chars. title maximum 100 chars. json" },
            ],
        });
        const image = await openai.images.generate({ prompt: subject });
        let openAiPost = {
            title: JSON.parse(completion.choices[0].message.content).title,
            body: JSON.parse(completion.choices[0].message.content).body,
            imageURL: image.data[0].url
        }
        return openAiPost;
    } catch (error) {
        return(error.message);
    }
}

const createNewPost = async (data)=>{
    try {
        let newPost =  new postModel(data);
        await newPost.save();
        return await getAllPosts();
    } catch (error) {
        return(error.message);
    }
};

const importPosts = async (posts)=>{
    try {
        const options = { ordered: true };
        const result = await postModel.insertMany(posts, options);
        return await getAllPosts();
    } catch (error) {
        return(error.message);
    }
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

// const getPostsBySearch = async (username, srchField, compSelect, srchText, sortBy, asc)=>{
//     let srchParams = {};
//     switch(srchField) {
//         case "username":
//             srchParams = {username: { $regex: srchText, $options:'i' }}
//             break;
//         case "title":
//             srchParams = {title: { $regex: srchText, $options:'i' }}
//             break;
//         case "director":
//             srchParams = {director: { $regex: srchText, $options:'i' }}
//             break;
//         case "airDate":
//             if (compSelect == '>') {
//                 srchParams = {airDate: { $gte: new Date(srchText).toDateString() }}  
//             } else {
//                 srchParams = {airDate: { $lte: new Date(srchText).toDateString() }}
//             }
//             break;
//         case "length":
//             if (compSelect == '>') {
//                 srchParams = {length: { $gt: Number(srchText) }}
//             } else {
//                 srchParams = {length: { $lt: Number(srchText) }}
//             }
//             break;
//         default:
//             srchParams = {title: { $regex: srchText, $options:'i' }}
//       }
//     try{
//         if (username != ""){
//             srchParams.username = username;
//         }
//         let posts = await postModel.find(srchParams).sort({[sortBy]: Number(asc)});
//         if (posts.length > 0) {
//             lastAction = "Get posts by search"
//             return posts;
//         } else {
//             lastAction = "Get posts by search - No posts found"
//             return lastAction;
//         }
//     } catch (error) {
//         lastAction = "Error getting posts by search: " + error.message
//         return lastAction;
//     }  
// };

const deletePost = async (id)=>{
    try {
        await postModel.findByIdAndDelete(id);
        return await getAllPosts();
    } catch (error) {
        return(error.message);
    }
};

const updatePost = async (id, data)=>{
    try {
        await postModel.findByIdAndUpdate(id, { $push: { reply: data } })
        return await getAllPosts();
    } catch (error) {
        return(error.message);
    }
};

module.exports = {
    createNewPost,
    getOpenAiPost,
    getAllPosts,
    deletePost,
    getPostsByUserId,
    getPostsByUserName,
    updatePost,
    // getPostsBySearch,
    importPosts
};