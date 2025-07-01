import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Stack } from "@mui/material"
import { useCookies } from "react-cookie";
import { SocketChatComp } from "./Socket_Comps/SocketChatComp"
import { EditUserComp } from './Users_Comps/CurrUserEditComp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen, faTrashCan, faWebAwesome } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2'
import AppContext from './appContext';
import noImage from '../data/noImage.png'; 
import Axios from './helpers'

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const socket = useSelector(state => state.socket);
    const [showChat, setShowChat] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [cookies] = useCookies({});

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
                            await Axios ("get", AppContext.POSTS_URL, [myToken, myUserId]).then((allPosts)=>{
                                if (typeof(allPosts) !== "string") {
                                    dispatch({ type: "GET_POSTS", payload: allPosts });
                                }  
                            })
                            // if(Object.keys(socket).length == 0){
                            //     dispatch({ type: "GET_SOCKET", payload: io (AppContext.SERVER_IP+AppContext.HTTP_PORT) });
                            // }
                            // navigate("/main/users");
                        }
                    } catch (error) {
                        navigate("/error/"+"No Credentials were found, Back to login!");
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    } 
                } else {
                    navigate("/error/"+"No Credentials were found, Back to login!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } 
            } else {
                let response = await Axios ("get", AppContext.USERS_URL, [token, currUser._id]);
                if (typeof(response) == "string") {
                    alert (response);
                    logoutUser("Logging out...")
                } else {
                    dispatch({ type: "GET_USERS", payload: response });
                    await Axios ("get", AppContext.POSTS_URL, [token, currUser._id]).then((allPosts)=>{
                        if (typeof(allPosts) !== "string") {
                            dispatch({ type: "GET_POSTS", payload: allPosts });
                        }  
                    })
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
            // Object.keys(socket).length>0?socket.disconnect():"";
            navigate("/error/"+title);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.log ('Error logging out:', err);
            return (new Error('Error logging out'));
        }
    }
    
    const deleteMyProfile = () => {
        Swal.fire({
            title: `Deleting your profile. Continue?`,
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
            actions: 'my-actions',
            confirmButton: 'order-1',
            denyButton: 'order-2',
            
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Axios ("delete", AppContext.USERS_URL+"/"+currUser._id, [token, currUser._id]).then((response) => {
                        if (response == "User deleted successfully!") {
                            Swal.fire('Profile Deleted. Good bye!', '', 'success');
                            logoutUser("Goodbye!!!");
                        }
                    });
                } catch (error) {
                    alert (error.message);
                }
            };
        });
    };

    return (
        <div style={{margin: "0 0 0 1rem"}}>
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
                {/* <CurrUserDetails logoutUserFunc={logoutUser}/> */}
                <div>
                    <div id="currUserCard" className="list-item" data-id="19">
                        <div className="d-flex flex-column">
                            <div id="adminIcon" title="Admin">{currUser.role_name=="Admin" && <FontAwesomeIcon icon={faWebAwesome}/>}</div>                     
                            <a href="#" data-abc="true"><img src={currUser.imageURL} style={{width:"90px", height: "90px", margin: "0 0 1rem 0.5rem"}} 
                                className="avatar gd-warning" onError={(e) => e.target.src = noImage}></img></a>
                        </div>
                        <div className="d-flex flex-row">
                            <div id="currUserName" className="d-flex flex-column">
                                <a href="#" className="userDetails item-author text-color fw-bold fs-4" data-abc="true">{currUser.fname} {currUser.lname}</a>
                                <p className="userDetails item-except fs-4">Age: {currUser.age}</p>
                                <p className="userDetails fs-5">{currUser.email}</p>
                                <p className="userDetails fs-5">{currUser.address}</p>
                            </div>
                            
                            <div id="actions" className="dark d-flex flex-row">
                                <Tooltip title={<p style={{fontSize:"1rem", margin: "0", padding: "0"}}>Edit my profile</p>}>
                                    <button id="editUserBtn" className="button-17" onClick={() => setModalShow(true)}>
                                        <i><FontAwesomeIcon icon={faUserPen}/></i></button>
                                </Tooltip>  
                                <Tooltip title={<p style={{fontSize:"1rem", margin: "0", padding: "0"}}>Delete my profile</p>}>
                                    <button id="deleteUserBtn" className="button-17" data-placement="top" 
                                    onClick={() => deleteMyProfile()}><i><FontAwesomeIcon icon={faTrashCan}/></i></button>
                                </Tooltip>  
                                
                            </div>
                        </div>
                    </div>
                    {
                    modalShow && <EditUserComp
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        // user={user}
                    />
                    }
                </div>
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