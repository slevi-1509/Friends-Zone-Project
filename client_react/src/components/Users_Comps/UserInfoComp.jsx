import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/esm/ModalBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faTrashCan, fas, faEnvelope, faLocationDot, faUserGroup, faCakeCandles, faVenusMars } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2'
import { SocketChatComp } from "../Socket_Comps/SocketChatComp"
import Axios from '../helpers'
import AppContext from '../appContext';
import "../../styles/UserInfo.css"

export const InfoUserComp=(props) => {
    const dispatch = useDispatch();
    const user = props.user;
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const users = useSelector(state => state.users);
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
                if ((user.FRI.findIndex(fro => fro == currUser._id)) != -1){
                    setFrBtn({icon: `faHandshakeSimple`, title: `You sent Friend Request to ${user.fname} ${user.lname}`});
                    setFrBtnStatus("button-17 disabled");
                } else if ((user.AllFriends.findIndex(fro => fro == currUser._id)) != -1) {
                    setFrBtn({icon: `faUserGroup`, title: `You and ${user.fname} ${user.lname} are friends`});
                    setFrBtnStatus("button-17 disabled");
                } else if ((user.FRO.findIndex(fro => fro == currUser._id)) != -1) {
                    setFrBtn({icon: `faHandHoldingHeart`, title: `Friend Request received from ${user.fname} ${user.lname}`});
                    setFrBtnStatus("button-17 enabled");
                } else {
                    
                } 
            }
        }
        getInfoUser();
    }, [])

    const sendFR = async () => {
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
                    const frRequest = {snd: user._id};
                    Swal.fire('Friend request accepted!', '', 'success');
                    /////// Create AllFriends records for users and delete FRI and FRO records /////
                    await Axios ("put", AppContext.USERS_URL+"/"+currUser._id+"/frapprove", [token, currUser._id], frRequest).then((response) => {
                        setFrBtn({icon: `faUserGroup`, title: `You and ${user.fname} ${user.lname} are friends`});
                        setFrBtnStatus("button-17 disabled");
                        dispatch({ type: "GET_USERS", payload: response });
                    });
                    // await axios.put(serverURL+"/"+currUser.username+"/frapprove", updatedRcvUser, params);
                    // await axios.put(serverURL+"/"+SndUserName+"/frapprove", updatedSndUser, params);
                    // setFrBtn({icon: `faUserGroup`, title: `You and ${user.fname} ${user.lname} are friends`});
                    // setFrBtnStatus("button-17 disabled");
                } else if (result.isDenied) {
                    /////// Delete FRI and FRO records /////
                    const frRequest = {snd: user._id};
                    await Axios ("put", AppContext.USERS_URL+"/"+currUser._id+"/frdelete", [token, currUser._id], frRequest).then((response) => {
                        Swal.fire('Friend request deleted!', '', 'info')
                        setFrBtn({icon: "faHand", title: `Send Friend Request to ${user.fname} ${user.lname}`})
                        dispatch({ type: "GET_USERS", payload: response });
                    });
                    
                } 
                // if (!result.isDismissed){
                //     debugger;
                //     await axios.put(serverURL+"/frdelete", updatedRcvUser, params);
                //     // await axios.put(serverURL+"/"+SndUserName+"/frdelete", updatedSndUser, params);
                //     dispatch({ type: "REFRESH_USERS", payload: !refreshUsers });  
                // }
            });
        } else {
            /////// Create FRO and FRI records respectively for Sender and Receiver of FR /////
            // debugger;
            const frRequest = {rcv: user._id};
            await Axios ("put", AppContext.USERS_URL+"/"+currUser._id+"/frrequest", [token, currUser._id], frRequest).then((response) => {
                setFrBtn({icon: `faHandshakeSimple`, title: `You sent Friend Request to ${user.fname} ${user.lname}`, class: {frBtnStatus}})
                setFrBtnStatus("button-17 disabled");
                dispatch({ type: "GET_USERS", payload: response });
            });
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
            <Modal
                {...props}
                size="lg"
                centered
                className="modern-user-info-modal"
            >
                <Modal.Header closeButton className="modern-modal-header">
                    <Modal.Title className="modern-modal-title">
                        User Profile
                    </Modal.Title>
                </Modal.Header>

                <ModalBody className="modern-modal-body">
                    <div className="modern-user-profile-container">
                        {/* Profile Header Section */}
                        <div className="profile-header-section">
                            <div className="profile-avatar-container">
                                <div className="avatar-ring">
                                    <img
                                        src={user.imageURL}
                                        className="profile-avatar-large"
                                        alt={`${user.fname} ${user.lname}`}
                                    />
                                </div>
                                {/* Friendship Status Indicator */}
                                {user._id !== currUser._id && (
                                    <div className="friendship-status-indicator">
                                        {user.AllFriends?.findIndex(fr => fr === currUser._id) !== -1 ? (
                                            <div className="status-badge friends-badge">
                                                <FontAwesomeIcon icon={faUserGroup} />
                                            </div>
                                        ) : user.FRI?.findIndex(fr => fr === currUser._id) !== -1 ? (
                                            <div className="status-badge pending-badge">
                                                <span>⏳</span>
                                            </div>
                                        ) : user.FRO?.findIndex(fr => fr === currUser._id) !== -1 ? (
                                            <div className="status-badge request-badge">
                                                <span>📬</span>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <div className="profile-header-info">
                                <h2 className="profile-user-name">{user.fname} {user.lname}</h2>
                                <div className="profile-role-badge">
                                    {user.role_name}
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Cards */}
                        <div className="quick-info-grid">
                            <div className="quick-info-card">
                                <div className="quick-info-icon">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                </div>
                                <div className="quick-info-content">
                                    <span className="quick-info-label">Gender</span>
                                    <span className="quick-info-value">{user.gender}</span>
                                </div>
                            </div>
                            <div className="quick-info-card">
                                <div className="quick-info-icon">
                                    <FontAwesomeIcon icon={faCakeCandles} />
                                </div>
                                <div className="quick-info-content">
                                    <span className="quick-info-label">Age</span>
                                    <span className="quick-info-value">{user.age}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="info-section">
                            <h3 className="info-section-title">
                                <FontAwesomeIcon icon={faEnvelope} className="section-icon" />
                                Contact Information
                            </h3>
                            <div className="info-section-content">
                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-item-label">Email Address</span>
                                        <span className="info-item-value">{user.email}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon-wrapper">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </div>
                                    <div className="info-content">
                                        <span className="info-item-label">Location</span>
                                        <span className="info-item-value">{user.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="profile-actions-section">
                            <h3 className="info-section-title">Actions</h3>
                            <div className="profile-actions-grid">
                                <Tooltip
                                    title={<span style={{fontSize:"0.875rem"}}>{frBtn.title}</span>}
                                    arrow
                                    placement="top"
                                >
                                    <button
                                        className={`modern-action-btn friend-request-btn ${frBtnStatus.includes('disabled') ? 'disabled' : ''}`}
                                        onClick={()=>sendFR()}
                                        disabled={frBtnStatus.includes('disabled')}
                                    >
                                        <FontAwesomeIcon icon={fas[frBtn.icon]} />
                                        <span>Friend Request</span>
                                    </button>
                                </Tooltip>

                                <Tooltip
                                    title={<span style={{fontSize:"0.875rem"}}>Start messaging with {user.fname} {user.lname}</span>}
                                    arrow
                                    placement="top"
                                >
                                    <button
                                        className="modern-action-btn message-btn"
                                        onClick={()=>{setMsgModalShow(true)}}
                                    >
                                        <FontAwesomeIcon icon={faMessage} />
                                        <span>Send Message</span>
                                    </button>
                                </Tooltip>

                                {
                                    currUser.role_name === "Admin" &&
                                    <Tooltip
                                        title={<span style={{fontSize:"0.875rem"}}>Delete user {user.fname} {user.lname}</span>}
                                        arrow
                                        placement="top"
                                    >
                                        <button
                                            className="modern-action-btn delete-btn"
                                            onClick={()=>{deleteUser()}}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                            <span>Delete User</span>
                                        </button>
                                    </Tooltip>
                                }
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {
                msgModalShow && <SocketChatComp
                    show={msgModalShow}
                    onHide={()=>setMsgModalShow(false)}
                    user={user}
                />
            }
        </div>
    );
  }