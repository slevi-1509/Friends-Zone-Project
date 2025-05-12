import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Stack } from "@mui/material"
import { useCookies } from "react-cookie";
import { SocketChatComp } from "./Socket_Comps/SocketChatComp"
import { CurrUserDetails } from "./Users_Comps/CurrUserDetailsComp"
import AppContext from './appContext';
import Axios from './helpers'

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const users = useSelector(state => state.users);
    const refreshUsers = useSelector(state => state.refreshUsers);
    const socket = useSelector(state => state.socket);
    const [usersList, setUsersList] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [openAiShow, setOpenAiShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies({});

    useEffect (() => {
        const getUserData = async () => {
            // debugger;
            if (token=="") {
                if (Object.keys(cookies).length > 0){
                    try {
                        let myUserId = Object.keys(cookies)[Object.keys(cookies).length-1];
                        let myToken = Object.values(cookies)[Object.values(cookies).length-1];
                        let response = await Axios ("get", AppContext.USERS_URL, [myToken, myUserId])
                        if (typeof(response) == "string") {
                            alert (response);
                            logoutUser("Logging out...")
                        } else {
                            dispatch({ type: "GET_USERS", payload: response });
                            dispatch({ type: "GET_CURRUSER", payload: response.find(user=>{return user._id == myUserId}) });
                            dispatch({ type: "GET_TOKEN", payload: myToken });
                            if(Object.keys(socket).length == 0){
                                dispatch({ type: "GET_SOCKET", payload: io (AppContext.SERVER_IP+AppContext.HTTP_PORT) });
                            }
                            navigate("/main/users");
                        }

                    } catch (error) {
                        navigate("/error/"+"No Credentials were found, Back to login!");
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    } 
                } else {
                    alert("No cookie found for this user, please login again!")
                    logoutUser("Logging out...")
                } 
            } else {
                let response = await Axios ("get", AppContext.USERS_URL, [token, currUser._id]);
                if (typeof(response) == "string") {
                    alert (response);
                    logoutUser("Logging out...")
                } else {
                    dispatch({ type: "GET_USERS", payload: response });
                    navigate("/main/users");
                    // dispatch({ type: "GET_CURRUSER", payload: response.find(user=>{return user.username == currUser.username}) });
                } 
            }
        }
        getUserData();
    }, [])

    const logoutUser = async (title) => {
        try {
            await Axios ("logout", AppContext.SERVER_IP+AppContext.APP_PORT+"/logout")
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
    
    return (
        <div style={{margin: "0 0 0 0.5rem"}}>
             <Stack spacing={1} direction="column" 
                justifyContent="center"
                >
                <p className="creepster-regular"><span>Welcome to FriendZone</span></p>
                <Stack spacing={2} direction="row" fontSize="1.5rem" style={{margin:"1.5rem 0 0.5rem 0"}}>
                    <Link to={'users'}>
                        Users
                    </Link>
                    <Link to={'posts'}>
                        Posts
                    </Link>
                    <button id="socketMsgBtn" className="navBtn" onClick={()=>setShowChat(true)}>Chat</button>
                    <button id="logoutBtn" className="navBtn" type="submit" onClick={()=>logoutUser("Logging out...\nSorry to see you go")}>Logout</button>
                </Stack>
                <CurrUserDetails logoutUserFunc={logoutUser}/>
                <Outlet/>
            </Stack>
            {  
                showChat && <SocketChatComp
                    show={showChat}
                    onHide={()=>setShowChat(false)}
                />                
            }
        </div>    
    )
}