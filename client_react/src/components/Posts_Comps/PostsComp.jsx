import axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, Stack, Divider } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFilter, faSortAmountDown, faRobot, faFileImport, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
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
    
    // Applying sorting and filtering on posts base on user inputs in the filters section.

    const filterAndSortPosts = () => {
        if (posts.length > 0) {
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
            alert ("Importing posts successfully!")
        });
    };

    const deletePost = async (postId) => {
        await Axios ("delete",`${AppContext.POSTS_URL}/${postId}`, [token, currUser._id]).then((response)=>{
            dispatch({ type: "GET_POSTS", payload: response });
        })
    }

    const clearFilters = () => {
        setSortSelect("date");
        setSortAsc(false);
        setSrchSelect("none");
        setSearchInput("");
        filterAndSortPosts();
    }

    return (
        <div className="modern-posts-container">
            {/* Header with Actions */}
            <div className="posts-header-section">
                <div className="posts-actions-bar">
                    <button className="new-post-btn" onClick={()=>setPostModalShow(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>New Post</span>
                    </button>
                    {/* <div className="utility-buttons">
                        <button className="utility-btn" onClick={()=>setOpenAiShow(true)}>
                            <FontAwesomeIcon icon={faRobot} />
                            <span>OpenAI</span>
                        </button>
                        <button className="utility-btn import-btn" onClick={importPosts}>
                            <FontAwesomeIcon icon={faFileImport} />
                            <span>Import</span>
                        </button>
                    </div> */}
                </div>

                {/* Filter Controls Card */}
                <div className="filter-controls-card">
                    <div className="filter-section-row">
                        {/* My Posts Toggle */}
                        <div className="my-posts-toggle">
                            <input
                                id="myPostsCheck"
                                type="checkbox"
                                className="modern-checkbox"
                                onChange={()=>{setShowMyPosts(!showMyPosts)}}
                            />
                            <label htmlFor="myPostsCheck" className="checkbox-label">
                                {/* <FontAwesomeIcon icon={faCheckSquare} /> */}
                                Show only my posts
                            </label>
                        </div>
                    </div>

                    <div className="filter-section-row">
                        {/* Sort Controls */}
                        <div className="control-group">
                            <label className="control-label">
                                <FontAwesomeIcon icon={faSortAmountDown} />
                                Sort by:
                            </label>
                            <select
                                className="modern-select"
                                value={sortSelect}
                                onChange={(e)=>{setSortSelect(e.target.value)}}
                            >
                                <option value="date">Date</option>
                                <option value="username">User Name</option>
                                <option value="title">Title</option>
                                <option value="body">Body</option>
                            </select>

                            <Button
                                variant="contained"
                                size="small"
                                className="sort-direction-btn"
                                sx={{
                                    height:"2.5rem",
                                    minWidth:"2.5rem",
                                    width:"2.5rem",
                                    borderRadius:"8px",
                                    backgroundColor:"#4F46E5",
                                    '&:hover': {
                                        backgroundColor: "#4338CA"
                                    }
                                }}
                                onClick={()=>setSortAsc(!sortAsc)}
                            >
                                {sortAsc?<ArrowUpwardIcon/>:<ArrowDownwardIcon/>}
                            </Button>
                        </div>

                        {/* Search Controls */}
                        <div className="control-group">
                            <label className="control-label">
                                <FontAwesomeIcon icon={faSearch} />
                                Search:
                            </label>
                            <select
                                className="modern-select"
                                value={srchSelect}
                                onChange={(e)=>{setSrchSelect(e.target.value)}}
                            >
                                <option value="none">None</option>
                                <option value="username">User Name</option>
                                <option value="title">Title</option>
                                <option value="body">Body</option>
                            </select>
                            <input
                                type="text"
                                className="modern-search-input"
                                value={searchInput}
                                placeholder="Search text..."
                                onChange={(e)=>{setSearchInput(e.target.value)}}
                            />
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="filter-btn apply-btn" onClick={filterAndSortPosts}>
                            Apply Filters
                        </button>
                        <button className="filter-btn clear-btn" onClick={clearFilters}>
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            {postsToShow.length > 0 && (
                <div className="posts-feed" ref={scrollDemoRef} onScroll={handleScroll}>
                    {postsToShow.map((post)=>{
                        return (<PostComp deletePost={deletePost} post={post} key={post._id}/>)
                    })}
                </div>
            )}

            {/* Empty State */}
            {postsToShow.length === 0 && (
                <div className="empty-posts-state">
                    <ErrorComp errMsg="No posts to show"/>
                </div>
            )}

            {/* Modals */}
            {openAiShow && (
                <OpenAiComp
                    show={openAiShow}
                    onHide={()=>setOpenAiShow(false)}
                />
            )}

            <NewPostComp
                show={postModalShow}
                onHide={() => setPostModalShow(false)}
            />
        </div>
    );
};