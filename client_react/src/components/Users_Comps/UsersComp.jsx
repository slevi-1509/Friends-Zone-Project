import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
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
    const [showMyFriends, setShowMyFriends] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const scrollDemoRef = useRef(null);

    useEffect (() => {
        const getUsers = async () => {
            console.log("render users comp")
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
            setUsersList([...tempArr]);
        }
        getUsers();
    }, [showMyFriends, users])
    
    return (
        <div>
            <div id="myFriendsDiv">
                <input id="myFriendsCheck" type="checkbox" onChange={()=>setShowMyFriends(!showMyFriends)}></input>
                <label htmlFor="myFriendsCheck"> Show Friends & Friend Requests</label>
                {/* <button onClick={()=>dispatch({ type: "REFRESH_USERS", payload: !refreshUsers })} id="refreshBtn" title='Refresh Users'><i><FontAwesomeIcon icon={faArrowsRotate}/></i></button> */}
            </div>
            {
                usersList.length > 0 && 
                    <div id="usersBody" ref={scrollDemoRef}>
                        {
                            usersList.sort((a, b) => (a.fname+a.lname).localeCompare(b.fname+b.lname)).map((user)=>{
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