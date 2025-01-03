import OpenAI from "openai";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import AppContext from '../appContext';
import '../../styles/Posts.css';
export const OpenAiComp = (props) => {

    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshPosts = useSelector(state => state.refreshPosts);
    const [subject, setSubject] = useState("");
    const [aiImage, setAiImage] = useState();
    const [aiPost, setAiPost] = useState({});
    const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
        }
    }

    

    useEffect (() => { 
        const getOpenAiResult = () => {
            
        }
        getOpenAiResult() 
    }, [])

    const getOpenAiPost = async () => {
        try {
            const openai = new OpenAI({apiKey: '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'
                , dangerouslyAllowBrowser: true});
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: {
                    type: 'json_object', // specify the format
                  },
                  messages: [
                    { role: "user", content: "post on subject" + subject + ", with title and body. body with at least 200 chars. title maximum 100 chars. json" },
                ],
            });
            setAiPost({ title: JSON.parse(completion.choices[0].message.content).title,
                body: JSON.parse(completion.choices[0].message.content).body
            })
            const image = await openai.images.generate({ prompt: subject });
            setAiImage(image.data[0].url); 
        } catch (error) {
            alert(error.message);
        }
        
    }

    const setAiPostDetails = (e) => {
        let { value, name } = e.target;
        setAiPost({...aiPost, [name]: value})
    }

    const saveNewPost = async () => {
        if (aiPost.body=="" || aiPost.title==""){
            alert ("Reply body is empty!")
        } else {
            let newPost = {...aiPost, username: currUser.username, date: Date.now(), imageURL: aiImage, reply: []}
            try {
                await axios.post(serverURL, newPost, params).then(({data:response}) => {
                    if (response != "New post created successfully!") {
                        alert(response);
                    };
                });
            } catch (error) {
                alert(error.message)
            }
            dispatch({ type: "REFRESH_POSTS", payload: !refreshPosts });
            props.onHide();
        }
    };   

    return (
        <div>
            <Modal 
                {...props}
                size="lg"
                centered
            >
                <div id="newPostModal"> 
                    <Modal.Header closeButton> 
                        <Modal.Title>
                            <h3> Create a new Open AI Post:</h3>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {
                            <div>
                                <div id="getAiSection">
                                    <input type="text" style={{display: "block", width:"75%", height:"2.5rem", fontSize:"1.2rem"}} id="aiSubject" className="postInput" name="subject" placeholder="Enter a subject for AI post:" onChange={(e)=>{setSubject(e.target.value)}} value={subject}></input>
                                    <button id="getAiPostBtn" onClick={() => getOpenAiPost()}>Get AI Post</button>
                                </div>
                                <hr style={{color:"white"}}></hr>
                                <label htmlFor="aiPostTitle">Title:</label>
                                <input type="text" className="postInput" id="aiPostTitle" name="title" onChange={setAiPostDetails} value={aiPost.title}></input> 
                                <label htmlFor="aiPostBody">Body:</label>
                                <div id="aiPostContainer">
                                    {/* <h3 style={{color: "red", backgroundColor: "white", display: "block"}}>{aiText}</h3> */}
                                    <textarea type="text" className="postInput" id="aiPostBody" name="body" onChange={setAiPostDetails} value={aiPost.body}></textarea>
                                    <img src={aiImage} style={{width:"120px", height: "120px"}} /> 
                                    {/* <input type="text" className="postInput" id="imageURL" name="imageURL" placeholder="Image URL:"/> */}
                                </div>
                                <div className="savePost">
                                    <button id="savePostBtn" onClick={() => saveNewPost()}>Post</button>
                                </div>
                            </div>
                        }
                    </Modal.Body>
                    
                    <div></div>
                </div> 
            </Modal>
        </div>
    );
}