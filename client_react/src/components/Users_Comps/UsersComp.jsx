import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, Stack, Divider } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UserComp } from "./UserComp"
import { ErrorComp } from "./../Error_Comps/ErrorComp"
import "../../styles/Users.css"
import AppContext from '../appContext';
import Axios from '../helpers'

export const UsersComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const users = useSelector(state => state.users);
    const refreshUsers = useSelector(state => state.refreshUsers);
    const socket = useSelector(state => state.socket);
    const [ sortSelect, setSortSelect ] = useState("fname");
    const [ sortAsc, setSortAsc ] = useState (true);
    const [showMyFriends, setShowMyFriends] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const scrollDemoRef = useRef(null);

    useEffect (() => {
        const getUsers = async () => {
            sortUsers();
        }
        getUsers();
    }, [showMyFriends, users])
    
    const sortUsers = () => {
        // debugger;
        let tempArr = [];
        if (!showMyFriends){
            tempArr = users.toSpliced(users.findIndex((user) => user._id == currUser._id),1);
        } else {
            users.map((user) => {
                if (
                    user.FRI.findIndex(fr=>fr == currUser._id) != -1 ||
                    user.FRO.findIndex(fr=>fr == currUser._id) != -1 ||
                    user.AllFriends.findIndex(fr=>fr == currUser._id) != -1 
                ){
                    tempArr.push(user);
                }
            })
        }
        if (sortAsc) {
            tempArr.sort((a, b) => {
            if (a[sortSelect] < b[sortSelect]) {
                return -1;
            }
            if (a[sortSelect] > b[sortSelect]) {
                return 1;
            }
            return 0;
            });
        } else {
            tempArr.sort((a, b) => {
                if (a[sortSelect] < b[sortSelect]) {
                    return 1;
                }
                if (a[sortSelect] > b[sortSelect]) {
                    return -1;
                }
                return 0;
                });
        }
        setUsersList([...tempArr]);
    }

    const clearFilters = () => {
        setSortSelect("fname");
        setSortAsc(true);
        sortUsers();
    }

    const refreshUsersList = async() => {
        await Axios ("get", AppContext.USERS_URL, [token, currUser._id]).then(response=>{
            if (typeof(response) == "string") {
                alert (response);
                logoutUser("Logging out...")
            } else {
                dispatch({ type: "GET_USERS", payload: response });
            } 
        });  
    }

    return (
        <div>
            <div id="myFriendsDiv">
                <input id="myFriendsCheck" type="checkbox" onChange={()=>setShowMyFriends(!showMyFriends)}></input>
                <label htmlFor="myFriendsCheck"> Show Friends & Friend Requests</label>
                {/* <button onClick={()=>dispatch({ type: "REFRESH_USERS", payload: !refreshUsers })} id="refreshBtn" title='Refresh Users'><i><FontAwesomeIcon icon={faArrowsRotate}/></i></button> */}
            </div>
            <section id="sortUsers">
                <label htmlFor="sortSelect">Sort by:</label>
                <select id="sortSelect" value={sortSelect} onChange={(e)=>{setSortSelect(e.target.value)}}>
                    <option value="fname">Name</option>
                    <option value="age">Age</option>
                    <option value="gender">Gender</option>
                </select>
                
                <Button
                    variant="contained" 
                    size="small"
                    sx={{
                        height:"1.8rem",
                        minWidth:"0",
                        width:"2rem",
                        margin: "0 1rem 0 0"
                    }} 
                    // size="small"
                    onClick={()=>setSortAsc(!sortAsc)}
                >
                    {sortAsc?<ArrowUpwardIcon/>:<ArrowDownwardIcon/>}
                </Button>
                <button className="usersBtn" onClick={sortUsers}>Apply</button>
                <button className="usersBtn" onClick={clearFilters}>Clear</button>
                <button onClick={refreshUsersList} id="refreshUsersBtn" title='Refresh Users List'><i><RefreshIcon/></i></button>
                
            </section>
            {
                usersList.length > 0 && 
                    <div id="usersBody" ref={scrollDemoRef}>
                        {
                            usersList.map((user)=>{
                                return (<UserComp user={user} key={user._id}/>);
                            })
                        }
                    </div>
            }
            {
                usersList.length === 0 && <ErrorComp errMsg='No friends to show yet...'></ErrorComp>
            }
        </div>
    )
}