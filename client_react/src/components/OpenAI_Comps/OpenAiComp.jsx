import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import AppContext from '../appContext';
import { SpinnerComp } from "../Error_Comps/SpinnerComp"
import '../../styles/Posts.css';
export const OpenAiComp = (props) => {

    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshPosts = useSelector(state => state.refreshPosts);
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [subject, setSubject] = useState("");
    const [aiImage, setAiImage] = useState();
    const [aiPost, setAiPost] = useState({});
    const [getAiBtn, setGetAiBtn] = useState(false);
    const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
            "subject": subject
        }
    }
    
    useEffect (() => { 
        const getOpenAiResult = () => {
            
        }
        getOpenAiResult() 
    }, [])
    
    const getOpenAiPost = async () => {
        if (subject==""){
            alert ("AI subject search is empty !!!")
        } else {
            try {
                setDisplaySpinner("block");
                setGetAiBtn(true)
                await axios.get(AppContext.POSTS_URL+"/"+currUser.username+"/openaipost", params).then(({data:response}) => {
                    setAiPost({ 
                        title: response.title,
                        body: response.body
                    })
                    setAiImage(response.imageURL); 
                    setDisplaySpinner("none");
                    setGetAiBtn(false)
                });
            } catch (error) {
                setDisplaySpinner("none");
                setGetAiBtn(false)
                alert (error.message);
            }
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
                                    <button id="getAiPostBtn" disabled={getAiBtn} onClick={() => getOpenAiPost()}>Get AI Post</button>
                                </div>
                                <hr style={{color:"white"}}></hr>
                                <label htmlFor="aiPostTitle">Title:</label>
                                <input type="text" className="postInput" id="aiPostTitle" name="title" onChange={setAiPostDetails} defaultValue={aiPost.title}></input> 
                                <label htmlFor="aiPostBody">Body:</label>
                                <div id="aiPostContainer">
                                    <textarea type="text" className="postInput" id="aiPostBody" name="body" onChange={setAiPostDetails} defaultValue={aiPost.body}></textarea>
                                    <img src={aiImage} style={{width:"120px", height: "120px"}} /> 
                                </div>
                                <div className="savePost d-flex flex-row">
                                    <button id="AiSavePostBtn" onClick={() => saveNewPost()}>Save</button>
                                    {displaySpinner=="block" && <div style={{transform: "scale(0.5)", marginTop:0, marginBottom:0, maxHeight:"2rem"}}><SpinnerComp/></div>}
                                </div>
                            </div>
                        }
                    </Modal.Body>
                </div> 
            </Modal>
        </div>
    );
}