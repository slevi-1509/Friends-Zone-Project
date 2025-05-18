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
import Axios from '../helpers'
import '../../styles/Posts.css';

export const PostsComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const posts = useSelector(state => state.posts);
    // const postsToShow = useSelector(state => state.postsToShow);
    // const refreshPosts = useSelector(state => state.refreshPosts);
    const [ postModalShow, setPostModalShow ] = useState(false);
    const [ showMyPosts, setShowMyPosts ] = useState(false);
    const [ postsToShow, setPostsToShow ] = useState([]);
    const [ sortSelect, setSortSelect ] = useState("date");
    const [ sortAsc, setSortAsc ] = useState (false);
    // const [ sortDir, setSortDir ] = useState("d");
    const [ srchSelect, setSrchSelect ] = useState("none");
    const [ searchInput, setSearchInput ] = useState("");
    const [ openAiShow, setOpenAiShow ] = useState(false);
    const [scrollPosition, setScrollPosition] = useState({ scrollTop: 0, scrollLeft: 0 });
    const scrollDemoRef = useRef(null);
    const postsURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts/";

    useEffect (() => { 
        filterAndSortPosts();
    }, [showMyPosts, posts])

    // const getPosts = async () => {
    //     try {
    //         let { data: response } = await axios.get(postsURL, createRequestHeaders(currUser.username, token));
    //         if (typeof(response) === "string") {
    //             alert (response);
    //         } else {
    //             dispatch({ type: "GET_POSTS", payload: response });
    //             filterAndSortPosts(response);
    //         }
    //     } catch (error) {
    //         alert (error.message);
    //     }        
    // }
    
    // Applying sorting and filtering on posts base on user inputs in the filters section.

    const filterAndSortPosts = () => {
        // debugger;
        let tempPostsArr = [];
        if (showMyPosts) {
            tempPostsArr = posts.filter((post)=>{return (post.username==currUser.username)});
        } else { 
            tempPostsArr = posts;
        };
        sortAsc ? tempPostsArr.sort((a, b) => a[sortSelect].localeCompare(b[sortSelect])) : tempPostsArr.sort((a, b) => b[sortSelect].localeCompare(a[sortSelect]));
        if (srchSelect!="none") {
            tempPostsArr = tempPostsArr.filter((post)=>{return post[srchSelect].toLowerCase().includes(searchInput.toLowerCase())})
        };
        setPostsToShow([...tempPostsArr]);
        // dispatch({ type: "POSTS_TO_SHOW", payload: tempPostsArr });
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
        await Axios ("delete",`${AppContext.POSTS_URL}/${postId}`, [token, currUser._id]).then((response)=>{
            dispatch({ type: "GET_POSTS", payload: response });
        })
        // await axios.delete(postsURL+postId, createRequestHeaders(currUser.username, token));
        // getPosts();
    }

    const clearFilters = () => {
        setSortSelect("date");
        setSortAsc(false);
        setSrchSelect("none");
        setSearchInput("");
        filterAndSortPosts();
    }

    return ( 
            <div id="postsContainer" className="bd-highlight mb-3">
                <section id="postsPageHeader">
                    {/* <div id="navbar">
                        <button className="navBtn"><Link id="postsLink" to={'/users'}>Users</Link></button>
                        <button className="navBtn" onClick={()=>setOpenAiShow(true)}>OpenAI</button>
                        <button id="importPostsgBtn" className="navBtn" onClick={importPosts}>Import posts</button>
                    </div> */}
                    <div>
                        <button className="postsBtn" onClick={()=>setPostModalShow(true)}>New Post</button>
                        <button className="postsBtn" onClick={filterAndSortPosts}>Apply</button>
                        <button className="postsBtn" onClick={clearFilters}>Clear</button>
                        <button className="postsBtn" style={{margin:'0 0.8rem 0 2rem'}} onClick={importPosts}>Import</button>
                        <button className="postsBtn" onClick={()=>setOpenAiShow(true)}>OpenAI</button>
                    </div>
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
                                        <select id="sortSelect" value={sortSelect} onChange={(e)=>{setSortSelect(e.target.value)}}>
                                            <option value="date">Date</option>
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
                                        <select id="srchSelect" value={srchSelect} onChange={(e)=>{setSrchSelect(e.target.value)}}>
                                            <option value="none">None</option>
                                            <option value="username">User Name</option>
                                            <option value="title">Title</option>
                                            <option value="body">Body</option>
                                        </select>
                                        <input type="text" id="searchInput" value={searchInput} placeholder="for text..." onChange={(e)=>{setSearchInput(e.target.value)}}/>
                                    </section>
                                </div>
                            }
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
                        onHide={() => setPostModalShow(false)}
                    />
                }
                {
                    postsToShow.length === 0 && <ErrorComp errMsg = "No posts to show !!!"/>
                }
            </div>
        );
};