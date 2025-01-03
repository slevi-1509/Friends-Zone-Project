import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css'; 
import { Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";  // Bootstrap components
import { ReplyPostComp } from "./ReplyPostComp"
import AppContext from '../appContext';
import '../../styles/Posts.css';
import noImage from '../../data/noImage.png'; 

export const PostComp = ({ deletePost, post }) => {
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshPosts = useSelector(state => state.refreshPosts);
    const [replyModalShow, setReplyModalShow] = useState(false);
    const [repliesToShow, setRepliesToShow] = useState([]);
    const [repliesText, setRepliesText] = useState("");
    const postsURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
        }
    }

    useEffect (() => {
        const getPost = () => {
            post.reply.sort((a,b)=>new Date(b.date) - new Date(a.date));
            if (post.reply.length==0){
                setRepliesText("No replies for this post")
            } else if (post.reply.length==1) {
                setRepliesText("No more replies")
                setRepliesToShow([post.reply[0]]);
            } else {
                setRepliesText("Show more")
                setRepliesToShow([post.reply[0]]);
            };
        }
        getPost()
    }, [refreshPosts]);

    // Check for comments in post, if exists, sorting by date  (newst first).
    // Showing last comment on post, set button to show more comments or to show less.

    const repliesToShowFunc = (e) => {
        post.reply.sort((a,b)=>new Date(b.date) - new Date(a.date));
        if (post.reply.length==0){
            setRepliesText("No replies for this post")
        } else if (post.reply.length==1) {
            setRepliesText("No more replies")
            setRepliesToShow([post.reply[0]]);
        } else {
            if(e!=undefined){
                if (e.innerText=="Show more"){
                    setRepliesToShow([...post.reply]);
                    setRepliesText("Show less");
                } else if (e.innerText=="Show less"){
                    setRepliesToShow([post.reply[0]]);
                    setRepliesText("Show more");
                }
            } else {
                if (repliesText=="Show more" || repliesText=="No more replies"){
                    setRepliesToShow([post.reply[0]]);
                    setRepliesText("Show more");
                } else if (repliesText=="Show less"){
                    setRepliesToShow([...post.reply]);
                }
            }
        };
    }

    // Receive the comment and the post ID from 'replyPostComp', check integrity and register to database.

    const checkReply = async (reply, postId) => {
        if (reply == undefined || Object.keys(reply).length == 0 || reply.body == ""){
            alert ("Reply is empty!")
        } else { 
            let newReply = {...reply, username: currUser.username, date: Date.now()}
            try {
                await axios.put(postsURL+"/"+postId, newReply, params).then(({data:response}) => {
                    Object.assign(post.reply, {[post.reply.length]: newReply});
                    repliesToShowFunc();
                });     
                hideModal();
            } catch (error) {
                alert(error.message);
            }
                        
        }
    };   

    const hideModal = () => {
        // repliesToShowFunc();
        setReplyModalShow(false)   
    }
    
    return (
        post && 
            <div id="postContainer" className="col-md-12" key={post._id}>
                <Card className="mb-1" style={{ border: "3px solid lightgrey", margin: "10px", height:"fit-content"}}>
                    <Card.Body style={{backgroundColor: "lightgrey"}}>
                        <div id="imgDiv" className="d-flex flex-column">
                            {
                                <Card.Img src={post.imageURL} style={{width:"70px", height: "70px"}} onLoad={(e)=>post.imageURL==""?e.target.src = noImage:""} onError={(e) => e.target.src = noImage}/> 
                            }
                        </div>
                        <div id="postHeader">
                            <Card.Subtitle> 
                                <p id="postDetails" className="mb-2 fs-6" style={{color: "grey"}}>Posted by <span className="fs-6" style={{color: "black"}}>
                                {post.username}</span> on {new Date(post.date).toLocaleDateString("he-IL")}</p>
                                {   
                                    currUser.username == post.username && 
                                    <Button id="deletePostBtn" variant="secondary" onClick={() => {deletePost(post._id)}}>Delete</Button>
                                }
                                <Button id="replyPostBtn" variant="primary" onClick={() => setReplyModalShow(true)}>Reply</Button>

                            </Card.Subtitle>
                            <Card.Title>{post.title}</Card.Title>
                            
                            <Card.Text>{post.body}</Card.Text>
                        </div>
                    </Card.Body >
                    <div>     
                        <ListGroup className="list-group-flush">
                            <div className="d-flex flex-row" style={{ height:"1.5rem"}}>
                                <p className="fw-bold fs-6" style={{ height:"1rem", margin:"0px", padding:"0 10px 0 0.3rem", color: "rgb(141, 16, 16)" }}>Replies: </p>
                                <a href="#" className="item-author text-color fs-6 fw-bold no-wrap" data-abc="true" onClick={(e) => repliesToShowFunc(e.target)}>{repliesText}</a>
                            </div>
                            <div>
                                {repliesToShow.length > 0 &&
                                    repliesToShow.sort((a,b)=>new Date(b.date) - new Date(a.date)).map((reply, idx) => (
                                        <ListGroupItem id="replyContainer" className="d-flex flex-row" key={idx}>
                                                <div className="d-flex flex-row">
                                                    <p id="replyName">{reply.username}: </p> 
                                                    <span id="replyText">{reply.body}</span>
                                                </div>
                                                <div id="replyTimeDiv" className="d-flex flex-column" style={{color: "grey", float: "right", height: "fit-content"}}>
                                                    <p className="timeInfo" style={{color: "black", margin: "0 0 0 0"}}>{new Date(reply.date).toLocaleDateString("he-IL")}</p>
                                                    <p className="timeInfo" style={{color: "black", margin: "0 0 0 0"}}>{new Date(reply.date).toLocaleTimeString("he-IL")}</p>
                                                </div>
                                        </ListGroupItem>
                                ))}
                            </div>
                        </ListGroup> 
                    </div>
                    
                </Card>
                {
                    replyModalShow && <ReplyPostComp
                        show={replyModalShow}
                        onHide={() => hideModal()}
                        post={post}
                        replyPost={checkReply}
                    />
                }
            </div>
    )
}