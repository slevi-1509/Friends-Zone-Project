import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
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
            >
                <div id="newPostModal"> 
                    <Modal.Header closeButton> 
                        <Modal.Title>
                            <h3> Create a new Post:</h3>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {
                            <div id="newPostContainer">
                                <input type="text" className="postInput" id="title" name="title" placeholder="Title" onChange={setPostDetails} required/>
                                <textarea type="text" className="postInput" id="body" name="body" placeholder="Body" 
                                    onChange={setPostDetails} required />
                                <input type="text" className="postInput" id="imageURL" name="imageURL" placeholder="Image URL:" onChange={setPostDetails} />
                                <div className="savePost">
                                    <button id="savePostBtn" onClick={saveNewPost}>Save</button>
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