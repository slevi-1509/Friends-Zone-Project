import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css';
import { Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faTrash, faChevronDown, faChevronUp, faCommentDots, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
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
            <article className="modern-post-card" key={post._id}>
                {/* Post Header */}
                <div className="post-card-header">
                    <div className="post-author-info">
                        <div className="author-avatar">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="author-details">
                            <span className="author-name">{post.username}</span>
                            <span className="post-date">
                                <FontAwesomeIcon icon={faClock} />
                                {new Date(post.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="post-card-body">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-body-text">{post.body}</p>

                    {post.imageURL && (
                        <div className="post-image-container">
                            <img
                                src={post.imageURL}
                                alt={post.title}
                                className="post-image"
                                onError={(e) => e.target.style.display = "none"}
                            />
                        </div>
                    )}
                </div>

                {/* Replies Section */}
                <div className="post-replies-section">
                    <div className="post-actions">
                        <button className="replies-toggle-btn" onClick={(e) => repliesToShowFunc(e.currentTarget)}>
                            <FontAwesomeIcon icon={faCommentDots} />
                            <span>{repliesText}</span>
                            <FontAwesomeIcon
                                icon={repliesText === "Show less" ? faChevronUp : faChevronDown}
                                className="toggle-icon"
                            />
                        </button>
                        <button className="post-action-btn reply-btn" onClick={() => setReplyModalShow(true)}>
                            <FontAwesomeIcon icon={faReply} />
                            <span>Reply</span>
                        </button>
                        {currUser.username === post.username && (
                            <button className="post-action-btn delete-btn last-item" onClick={() => deletePost(post._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Delete</span>
                            </button>
                        )}
                    </div>

                    {repliesToShow.length > 0 && (
                        <div className="replies-container">
                            {repliesToShow.sort((a,b)=>new Date(b.date) - new Date(a.date)).map((reply, idx) => (
                                <div className="reply-item" key={idx}>
                                    <div className="reply-header">
                                        <div className="reply-author">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span className="reply-username">{reply.username}</span>
                                        </div>
                                        <div className="reply-timestamp">
                                            <span>{new Date(reply.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                                            <span>{new Date(reply.date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <p className="reply-text">{reply.body}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reply Modal */}
                {replyModalShow && (
                    <ReplyPostComp
                        show={replyModalShow}
                        onHide={() => hideModal()}
                        post={post}
                        replyPost={checkReply}
                    />
                )}
            </article>
    )
}