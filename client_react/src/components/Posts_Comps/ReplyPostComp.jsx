import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import '../../styles/Posts.css';

export const ReplyPostComp=({show, onHide, post, replyPost}) => {
    const [reply, setReply] = useState({});
    const postId = post._id;

    useEffect (() => {
        const replyPost = () => {
            
        }
        replyPost();
    }, [])     

    const setReplyDetails = (e) => {
        let { value, name } = e.target;
        setReply({...reply, [name]: value})
    }
    
    return (
        <div>
            <Modal 
                show={show}
                onHide={onHide}
                size="lg"
                centered
            >
                <div id="newPostModal"> 
                    <Modal.Header closeButton> 
                        <Modal.Title>
                            <h3>Write a reply to the post:</h3>
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        {
                            <div id="newPostContainer">
                                <textarea type="text" className="postInput" id="body" name="body" placeholder="Reply" 
                                    onChange={setReplyDetails} required />
                                
                                <div className="replyPost">
                                    <Button id="savePostBtn" onClick={()=>replyPost(reply, postId)}>Reply</Button>
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