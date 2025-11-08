import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faImage, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../appContext';
import '../../styles/Posts.css';

export const NewPostComp=(props) => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    // const refreshPosts = useSelector(state => state.refreshPosts);
    const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";
    const [post, setPost] = useState({});
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
        }
    }

    useEffect (() => {
        const newPost = async () => {
            
            }
        newPost();
    }, [])     

    const setPostDetails = (e) => {
        let { value, name } = e.target;
        setPost({...post, [name]: value})
    }

    const saveNewPost = async () => {
        if (post.body=="" || post.title==""){
            alert ("Post data is empty!")
        } else {
            let newPost = {...post, username: currUser.username, date: Date.now(), reply: []}
            try {
                await axios.post(serverURL, newPost, params).then(({data:response}) => {
                    dispatch({ type: "GET_POSTS", payload: response });
                    // if (response != "New post created successfully!") {
                    //     alert(response);
                    // };
                });
            } catch (error) {
                alert(error.message)
            }
            props.onHide();
        }
    };   

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                centered
                className="modern-new-post-modal"
            >
                <Modal.Header closeButton className="modern-post-header">
                    <Modal.Title className="modern-post-title">
                        <FontAwesomeIcon icon={faPencilAlt} />
                        Create New Post
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modern-post-body">
                    <div className="new-post-form">
                        <div className="form-group">
                            <label htmlFor="title" className="post-form-label">
                                <FontAwesomeIcon icon={faFileAlt} />
                                Post Title
                            </label>
                            <input
                                type="text"
                                className="modern-post-input"
                                id="title"
                                name="title"
                                placeholder="Enter an engaging title..."
                                onChange={setPostDetails}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="body" className="post-form-label">
                                <FontAwesomeIcon icon={faPencilAlt} />
                                Post Content
                            </label>
                            <textarea
                                className="modern-post-textarea"
                                id="body"
                                name="body"
                                placeholder="Share your thoughts..."
                                onChange={setPostDetails}
                                rows="6"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageURL" className="post-form-label">
                                <FontAwesomeIcon icon={faImage} />
                                Image URL (Optional)
                            </label>
                            <input
                                type="text"
                                className="modern-post-input"
                                id="imageURL"
                                name="imageURL"
                                placeholder="https://example.com/image.jpg"
                                onChange={setPostDetails}
                            />
                        </div>

                        <div className="post-form-actions">
                            <button className="modern-post-btn cancel-post-btn" onClick={props.onHide}>
                                Cancel
                            </button>
                            <button className="modern-post-btn save-post-btn" onClick={saveNewPost}>
                                Publish Post
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
  }