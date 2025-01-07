import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/esm/ModalBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faTrashCan, fas } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2'
import { SocketChatComp } from "../Socket_Comps/SocketChatComp"
import AppContext from '../appContext';
import "../../styles/UserInfo.css"

export const InfoUserComp=(props) => {
    const dispatch = useDispatch();
    const user = props.user;
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshUsers = useSelector(state => state.refreshUsers);
    const serverURL = AppContext.USERS_URL;
    const showChat = useSelector(state => state.showChat);
    const [msgModalShow, setMsgModalShow] = useState(false);
    const [frBtn, setFrBtn] = useState({icon: "faHand", title: `Send Friend Request to ${user.fname} ${user.lname}`})
    const [frBtnStatus, setFrBtnStatus] = useState("button-17 enabled")
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
        }
    }

    useEffect (() => {
        const getInfoUser = () => {
            if (currUser._id != user._id){
                if ((user.FRI.findIndex(fro => fro == currUser.username)) != -1){
                    setFrBtn({icon: `faHandshakeSimple`, title: `You sent Friend Request to ${user.fname} ${user.lname}`});
                    setFrBtnStatus("button-17 disabled");
                } else if ((user.AllFriends.findIndex(fro => fro == currUser.username)) != -1) {
                    setFrBtn({icon: `faUserGroup`, title: `You and ${user.fname} ${user.lname} are friends`});
                    setFrBtnStatus("button-17 disabled");
                } else if ((user.FRO.findIndex(fro => fro == currUser.username)) != -1) {
                    setFrBtn({icon: `faHandHoldingHeart`, title: `Friend Request received from ${user.fname} ${user.lname}`});
                    setFrBtnStatus("button-17 enabled");
                } else {
                    
                } 
            }
        }
        getInfoUser();
    }, [])

    const sendFR = async (username) => {
        let SndUserName = user.username;
        let updatedSndUser = {FRO: currUser.username};
        let updatedRcvUser = {FRI: SndUserName};
        if (frBtn.icon=="faHandshakeSimple"){
            alert ("Friend Request was already sent !!!")
        } else if (frBtn.icon=="faUserGroup"){
            alert ("You are already friends !!!")
        } else if (frBtn.icon=="faHandHoldingHeart"){
            Swal.fire({
                title: `Accept Friend Request?`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                focusConfirm: false,
                customClass: {
                actions: 'my-actions',
                confirmButton: 'order-1',
                denyButton: 'order-2 right-gap',
                cancelButton: 'order-3'
                },
            }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Friend request accepted!', '', 'success');
                /////// Create AllFriends records for users and delete FRI and FRO records /////
                await axios.put(serverURL+"/"+currUser.username+"/frapprove", updatedRcvUser, params);
                await axios.put(serverURL+"/"+SndUserName+"/frapprove", updatedSndUser, params);
                setFrBtn({icon: `faUserGroup`, title: `You and ${user.fname} ${user.lname} are friends`});
                setFrBtnStatus("button-17 disabled");
            } else if (result.isDenied) {
                /////// Delete FRI and FRO records /////
                Swal.fire('Friend request deleted!', '', 'info')
                setFrBtn({icon: "faHand", title: `Send Friend Request to ${user.fname} ${user.lname}`})
            } 
            if (!result.isDismissed){
                await axios.put(serverURL+"/"+currUser.username+"/frdelete", updatedRcvUser, params);
                await axios.put(serverURL+"/"+SndUserName+"/frdelete", updatedSndUser, params);
                dispatch({ type: "REFRESH_USERS", payload: !refreshUsers });  
            }
            })
            
        } else {
            /////// Create FRO and FRI records respectively for Sender and Receiver of FR /////
            const updatedSndUser = {FRO: username};
            await axios.put(serverURL+"/"+currUser.username+"/request", updatedSndUser, {
                headers: {"x-access-token": token,
                    "Content-Type": "application/json" }})
            const updatedRcvUser =  {FRI: currUser.username};
            await axios.put(serverURL+"/"+username+"/request", updatedRcvUser, {
                headers: {"x-access-token": token,
                    "Content-Type": "application/json" }})
            setFrBtn({icon: `faHandshakeSimple`, title: `You sent Friend Request to ${user.fname} ${user.lname}`, class: {frBtnStatus}})
            setFrBtnStatus("button-17 disabled");
            dispatch({ type: "REFRESH_USERS", payload: !refreshUsers });
        }
    }

    const deleteUser = async () => {
        Swal.fire({
            title: 'Delete user ' + [user.fname] + " " + [user.lname] + "?",
            showDenyButton: true,
            showCancelButton: false,
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
                    await axios.delete(serverURL+"/"+user._id, params).then(({data:response}) => {
                        if (response=='User deleted successfully!') {
                            Swal.fire('User deleted successfully!', '', 'success');
                            dispatch({ type: "REFRESH_USERS", payload: !refreshUsers });
                        } else {
                            alert ('No User found with that ID!');
                        }
                    });
                } catch (error) {
                    alert(error.message)
                }
            } 
        });
    }  

    return (
        <div>
            <Modal id="infoUserModal"
                {...props}
                size="lg"
                centered
            >
                <div id="modalContent">
                    <Modal.Header id="infoUserHeader" closeButton> 
                        <Modal.Title>
                            <p>{user.fname} {user.lname} details:</p>
                        </Modal.Title>
                    </Modal.Header>
                    <ModalBody id="infoUserModalBody">
                        <div id="userDetailsContainer" className="card user-card-full col-md-12">
                            <div className="col-sm-12 bg-c-lite-green user-profile">
                                <div className="card-block text-center text-white">
                                    <div className="m-b-10">
                                        <img src={user.imageURL} className="m-b-20 img-radius" alt="User-Profile-Image" style={{height:"150px", width:"150px", borderRadius:"30%"}}/>
                                    </div>
                                    <h6 className="f-w-500 fs-1 fw-bolder mb-3 text-dark">{user.fname} {user.lname}</h6>
                                    <p className="fs-3 mb-4">User Role: <strong>{user.role_name}</strong></p>
                                    <p className="mb-0 fs-3">Age : <strong>{user.age}</strong></p>
                                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                </div>
                            </div>
                            <div className="card-block">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h4 className="text-muted m-b-5">Email</h4>
                                        <h3 className="m-b-20 fs-4">{user.email}</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h4 className="text-muted m-b-5">Address</h4>
                                        <h3 className="fs-4">{user.address}</h3>
                                    </div>
                                </div>
                                <div className="iconsDiv">
                                    
                                    <Tooltip title={<p style={{fontSize:"1rem", margin: "0", padding: "0"}}>{frBtn.title}</p>} arrow placement="top">
                                        <button id="frBtn" role="button" className={frBtnStatus} 
                                            onClick={()=>sendFR(user.username)}><i><FontAwesomeIcon icon={fas[frBtn.icon]}/></i></button>
                                    </Tooltip>
                                    <Tooltip title={<p style={{fontSize:"1rem", margin: "0", padding: "0"}}>Start messaging with {user.fname} {user.lname}</p>} 
                                        arrow placement="top">
                                        <button id="imBtn" role="button" className="button-17"
                                            onClick={()=>{setMsgModalShow(true)}}><i><FontAwesomeIcon icon={faMessage}/></i></button>
                                    </Tooltip>
                                    {  
                                        msgModalShow && <SocketChatComp
                                            show={msgModalShow}
                                            onHide={()=>setMsgModalShow(false)}
                                            user={user}
                                        />                
                                    }
                                    {/* {
                                        msgModalShow && <MsgModalComp
                                        show={msgModalShow}
                                        onHide={() => setMsgModalShow(false)}
                                        user={user}
                                        />
                                    } */}
                                    {
                                        currUser.role_name=="Admin" && 
                                        <Tooltip title={<p style={{fontSize:"1rem", margin: "0", padding: "0"}}>Delete user {user.fname} {user.lname}</p>} arrow placement="top">
                                            <button id="deleteUserBtn" role="button" className="button-17" data-placement="top"  
                                            onClick={()=>{deleteUser()}}><i><FontAwesomeIcon icon={faTrashCan}/></i></button>
                                        </Tooltip>   
                                       
                                    }    
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </div>
            </Modal>

        </div>
    );
  }