import axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, Stack, Divider } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { PostComp } from "./PostComp"
import { NewPostComp } from "./NewPostComp"
import { ErrorComp } from "../Error_Comps/ErrorComp"
import { OpenAiComp } from "../OpenAI_Comps/OpenAiComp"
import AppContext from '../appContext';
import '../../styles/Posts.css';

export const PostsComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const postsToShow = useSelector(state => state.postsToShow);
    const refreshPosts = useSelector(state => state.refreshPosts);
    const [ postModalShow, setPostModalShow ] = useState(false);
    const [ showMyPosts, setShowMyPosts ] = useState(false);
    const [ sortSelect, setSortSelect ] = useState("date");
    const [ sortAsc, setSortAsc ] = useState (true);
    // const [ sortDir, setSortDir ] = useState("d");
    const [ srchSelect, setSrchSelect ] = useState("none");
    const [ searchInput, setSearchInput ] = useState("");
    const [ openAiShow, setOpenAiShow ] = useState(false);
    const [scrollPosition, setScrollPosition] = useState({ scrollTop: 0, scrollLeft: 0 });
    const scrollDemoRef = useRef(null);
    const postsURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";

    useEffect (() => { 
        const postsRefresh = async () => {
            if (token=="") {
                navigate("/users/");  
            } else {
                getPosts();
            }
        }
        postsRefresh() 
    }, [refreshPosts, showMyPosts])

    const getPosts = async () => {
        try {
            let { data: response } = await axios.get(postsURL, createRequestHeaders(currUser.username, token));
            if (response.includes("No posts found")) {
                dispatch({ type: "CLEAR_POSTS" });
            } else if (typeof response == "string") {
                alert (response);
            } else {
                dispatch({ type: "GET_POSTS", payload: response });
                filterAndSortPosts(response);
            }
        } catch (error) {
            alert (error.message);
        }        
    }
    
    // Applying sorting and filtering on posts base on user inputs in the filters section.

    const filterAndSortPosts = (response) => {
        let tempPostsArr = [];
        if (showMyPosts) {
            tempPostsArr = response.filter((post)=>{return (post.username==currUser.username)});
        } else { 
            tempPostsArr = response;
        };
        sortAsc ? tempPostsArr.sort((a, b) => a[sortSelect].localeCompare(b[sortSelect])) : tempPostsArr.sort((a, b) => b[sortSelect].localeCompare(a[sortSelect]));
        if (srchSelect!="none") {
            tempPostsArr = tempPostsArr.filter((post)=>{return post[srchSelect].toLowerCase().includes(searchInput.toLowerCase())})
        };
        dispatch({ type: "POSTS_TO_SHOW", payload: tempPostsArr });
    }

    const createRequestHeaders = (username, token) => {
        return {
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json"},
            params: {
                "username": username,
            }

        }
    }

    const handleScroll = () => {
        if (scrollDemoRef.current) {
        const { scrollTop, scrollLeft } = scrollDemoRef.current;
        setScrollPosition({ scrollTop, scrollLeft });
        }
    };

    // // Import posts to the database from 'client_react\src\data\posts.json' file.

    const importPosts = async () => {
        let posts=[];
        const postsPath = '../src/data/posts.json';
        await axios.get(postsPath).then(({data:response}) => {
            posts = response;
        });
        await axios.post(postsURL+"import", posts).then(({data:response}) => {
            alert ("Posts import: " + response)
        });
    };

    const deletePost = async (postId) => {
        try {
            await axios.delete(postsURL+postId, createRequestHeaders(currUser.username, token));
            getPosts();
        } catch (error) {
            alert (error.message);
        }
    }

    const refresh = () => {
        dispatch({ type: "REFRESH_POSTS", payload: !refreshPosts });
        setPostModalShow(false);
    }

    return ( 
            <div id="postsContainer" className="bd-highlight mb-3">
                <section id="postsPageHeader">
                    {/* <div id="navbar">
                        <button className="navBtn"><Link id="postsLink" to={'/users'}>Users</Link></button>
                        <button className="navBtn" onClick={()=>setOpenAiShow(true)}>OpenAI</button>
                        <button id="importPostsgBtn" className="navBtn" onClick={importPosts}>Import posts</button>
                    </div> */}
                    <div id="utilitySection">
                        {/* <p id="postsTitle" className="creepster-regular text-left">Posts</p> */}
                        <div id="searchAndSortDiv">
                            {
                                <div>
                                    <div id="myPostsDiv">
                                        <input id="myPostsCheck" type="checkbox" onChange={()=>{setShowMyPosts(!showMyPosts)}}/>
                                        <label htmlFor="myPostsCheck" style={{color: "yellow"}}> Show only my posts</label>
                                    </div>
                                    <section id="sortPosts">
                                        <label htmlFor="sortSelect">Sort by:</label>
                                        <select id="sortSelect" onChange={(e)=>{setSortSelect(e.target.value)}}>
                                            <option value="postDate">Date</option>
                                            <option value="username">User Name</option>
                                            <option value="title">Title</option>
                                            <option value="body">Body</option>
                                        </select>
                                        
                                        <Button
                                            variant="contained" 
                                            // size="small"
                                            sx={{
                                                height: "1.5rem",
                                                width: "1rem"  
                                            }} 
                                            onClick={()=>setSortAsc(!sortAsc)}
                                        >
                                            {sortAsc?<ArrowUpwardIcon/>:<ArrowDownwardIcon/>}
                                        </Button>
                                        {/* <select name="orderDir" id="orderDir" multiple>
                                            <option title="Ascending" onClick={()=>{setSortDir("a")}}>A</option>
                                            <option title="Descending" onClick={()=>{setSortDir("d")}}>D</option>
                                        </select> */}
                                    </section>
                                    <section id="searchPosts">
                                        <label htmlFor="srchSelect">Search in:</label>
                                        <select id="srchSelect" onChange={(e)=>{setSrchSelect(e.target.value)}}>
                                            <option value="none">None</option>
                                            <option value="username">User Name</option>
                                            <option value="title">Title</option>
                                            <option value="body">Body</option>
                                        </select>
                                        <input type="text" id="searchInput" placeholder="for text..." onChange={(e)=>{setSearchInput(e.target.value)}}/>
                                    </section>
                                </div>
                            }
                            <div>
                                <button id="addPostBtn" onClick={() => setPostModalShow(true)}>New Post</button>
                                <button id="postsRefreshBtn" onClick={()=>dispatch({ type: "REFRESH_POSTS", payload: !refreshPosts })}>Refresh</button>
                                <button id="importPostsgBtn" className="navBtn" onClick={importPosts}>Import posts</button>
                                <button className="navBtn" onClick={()=>setOpenAiShow(true)}>OpenAI</button>
                            </div>
                        </div>
                    </div>
                </section>
                {  
                    openAiShow && <OpenAiComp
                        show={openAiShow}
                        onHide={()=>setOpenAiShow(false)}
                    />                
                }
                {
                    postsToShow.length > 0 && 
                        <div id="postsBody" ref={scrollDemoRef} onScroll={handleScroll}>
                            {
                                postsToShow.map((post)=>{
                                    return (<PostComp deletePost={deletePost} post={post} key={post._id}/>)
                                })
                            }
                        </div>
                }

                {
                    <NewPostComp
                        show={postModalShow}
                        onHide={refresh}
                    />
                }
                {
                    postsToShow.length == 0 && <ErrorComp errMsg = "No posts to show !!!"/>
                }
            </div>
        );
};