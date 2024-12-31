import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import { UserComp } from "./UserComp"
import { UserDetailsComp } from "./CurrUserDetailsComp"
import { ErrorComp } from "./../Error_Comps/ErrorComp"
import { SocketChatComp } from "../Socket_Comps/SocketChatComp"
import "../../styles/Users.css"
import AppContext from '../appContext';

export const UsersComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const tempArr = useSelector(state => state.tempArr);
    const users = useSelector(state => state.users);
    const refreshUsers = useSelector(state => state.refreshUsers);
    const showChat = useSelector(state => state.showChat);
    const socket = useSelector(state => state.socket);
    const [showMyFriends, setShowMyFriends] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies({});
    const scrollDemoRef = useRef(null);

    useEffect (() => {
        const getUsers = async () => {
            if (token=="") {
                if (Object.keys(cookies).length > 0){
                    for (const key in cookies) {
                        try {
                            let { data: response } = await axios.get(AppContext.USERS_URL, createRequestHeaders(key, cookies[key]));
                            if (typeof(response) == "string") {
                                alert (response);
                                logoutUser("Logging out...")
                            } else {
                                dispatch({ type: "GET_USERS", payload: response });
                                dispatch({ type: "GET_CURRUSER", payload: response.find(user=>{return user.username == key}) });
                                dispatch({ type: "GET_TOKEN", payload: cookies[key] });
                                if(Object.keys(socket).length == 0){
                                    dispatch({ type: "GET_SOCKET", payload: io (AppContext.SERVER_IP+AppContext.HTTP_PORT) });
                                }
                                if (showMyFriends==false){
                                    dispatch({ type: "GET_TEMPARR", payload:response.toSpliced(response.findIndex((user) => user.username == key),1)});
                                } else {
                                    dispatch({ type: "GET_TEMPARR", payload:response.filter((user) => {return (user.AllFriends == key )})});
                                }
                            }

                        } catch (error) {
                            navigate("/error/"+"No Credentials were found, Back to login!");
                            setTimeout(() => {
                                navigate("/login");
                            }, 1000);
                        } 
                    }
                } else {
                    alert("No cookie found for this user, please login again!")
                    logoutUser("Logging out...")
                } 
            } else {
                let { data: response } = await axios.get(AppContext.USERS_URL, createRequestHeaders(currUser.username, token));
                if (typeof(response) == "string") {
                    alert (response);
                    logoutUser("Logging out...")
                } else {
                    dispatch({ type: "GET_USERS", payload: response });
                    if (showMyFriends==false){
                        dispatch({ type: "GET_TEMPARR", payload:response.toSpliced(response.findIndex((user) => user._id == currUser._id),1)});
                    } else {
                        let tempArr=[];
                        response.map((user)=>{
                            user.AllFriends.map((f)=>{
                                if(f==currUser.username){
                                    tempArr.push(user);
                                }
                            })
                            user.FRI.map((f)=>{
                                if(f==currUser.username){
                                    tempArr.push(user);
                                }
                            })
                            user.FRO.map((f)=>{
                                if(f==currUser.username){
                                    tempArr.push(user);
                                }
                            })
                        })
                        dispatch({ type: "GET_TEMPARR", payload: tempArr });
                    }
                }            
            }
        }
        getUsers();
    }, [showMyFriends, refreshUsers])

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

    const logoutUser = async (title) => {
        try {
            await axios.post(AppContext.SERVER_IP+AppContext.APP_PORT+"/logout")
            Object.keys(socket).length>0?socket.disconnect():"";
            navigate("/error/"+title);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.log ('Error logging out:', err);
            return (new Error('Error logging out'));
        }
    }
    
    const importMsg = async () => {
        let messages = [];
        const msgPath = '../src/data/messages.json';
        await axios.get(msgPath).then(({data:response}) => {
            messages = response;
        });
        await axios.post(AppContext.MESSAGES_URL+"/import", messages).then(({data:response}) => {
            alert ("Messages import: " + response)
        });
    }

    const closeConnection = () => {
        dispatch({ type: "SHOW_CHAT", payload: false });
    }
    
    return (
        currUser && users.length > 0 && token != "" &&
            <div id="usersContainer" className="bd-highlight mb-3">
                <section id="usersPageHeader">
                    <div id="navbar">
                        <button className="navBtn"><Link id="postsLink"  to={'/posts'}>Posts</Link></button>
                        <button id="socketMsgBtn" className="navBtn" onClick={()=>dispatch({ type: "SHOW_CHAT", payload: true })}>Chat</button>
                        <button id="logoutBtn" className="navBtn" type="submit" onClick={()=>logoutUser("Logging out...\nSorry to see you go")}>Logout</button>
                        <button id="importMsgBtn" className="navBtn" onClick={importMsg}>Import Messages</button>
                    </div>
                    <p className="creepster-regular"><span>Welcome to FriendZone</span></p>
                    <div id="myFriendsDiv">
                        <input id="myFriendsCheck" type="checkbox" onChange={()=>setShowMyFriends(!showMyFriends)}></input>
                        <label htmlFor="myFriendsCheck"> Show Friends & Friend Requests:</label>
                    </div>
                    {
                        <div>
                            <UserDetailsComp logoutUserFunc={logoutUser} user={currUser}/>
                        </div>
                    }
                </section>
                    
                
                    {
                        users.length > 0 && 
                            <div id="usersBody" ref={scrollDemoRef}>
                                {
                                    tempArr.sort((a, b) => (a.fname+a.lname).localeCompare(b.fname+b.lname)).map((user)=>{
                                        return (<UserComp user={user} key={user._id}/>)
                                    })
                                }
                            </div>
                    }
                {
                    tempArr.length == 0 && <ErrorComp errMsg='No friends to show yet...'></ErrorComp>
                }
                {  
                    showChat && <SocketChatComp
                        show={showChat}
                        onHide={()=>closeConnection()}
                    />                
                }
            </div>
        )
}