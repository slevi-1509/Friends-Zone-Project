import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingHeart, faUserGroup, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons'
import { InfoUserComp } from './UserInfoComp'
import "../../styles/User.css"
import noImage from '../../data/noImage.png'; 


export const UserComp = ({ user }) => {
    const currUser = useSelector(state => state.currUser);
    // const token = useSelector(state => state.token);
    const [infoUserShow, setInfoUserShow] = useState(false);
    // const [frStatus, setFrStatus] = useState();
    // const [frRefresh, setFrRefresh] = useState(false);

    useEffect (() => {
    }, []);

    const hideModal = () => {
        // setFrRefresh(!frRefresh);
        setInfoUserShow(false);
    }

    const getFrStatus = () => {
        if (currUser._id != user._id){
            ////////// Checking if user received FRI from current user FRO /////
            if ((user.FRI.findIndex(sender => sender == currUser._id)) != -1){
                return (<span className="frIcon"><i><FontAwesomeIcon icon={faHandshakeSimple} title={`You sent Friend Request to ${user.fname} ${user.lname}`}/></i></span>);
            ///////// Checking if user and current user are friends (AllFriends field) //////
            } else if ((user.AllFriends.findIndex(fro => fro == currUser._id)) != -1) {
                return (<span className="frIcon"><i><FontAwesomeIcon icon={faUserGroup} title={`You and ${user.fname} ${user.lname} are friends!`}/></i></span>)
            //////// Checking if user sent a FR for the current user /////
            } else if ((user.FRO.findIndex(receiver => receiver == currUser._id)) != -1) {
                return (<span className="frIcon"><i><FontAwesomeIcon icon={faHandHoldingHeart} title={`Friend Request received from ${user.fname} ${user.lname}`}/></i></span>)
            } 
        }   
    }

    return (
        user &&
            <>
                <div className="modern-user-card" onClick={()=>setInfoUserShow(true)}>
                    <div className="user-card-content">
                        <div className="user-avatar-wrapper">
                            <img
                                className="user-avatar"
                                src={user.imageURL}
                                alt={`${user.fname} ${user.lname}`}
                                onError={(e) => e.target.src = noImage}
                            />
                            {getFrStatus() && (
                                <div className="friend-status-badge">
                                    {getFrStatus()}
                                </div>
                            )}
                        </div>

                        <div className="user-info">
                            <h3 className="user-name">{user.fname} {user.lname}</h3>
                            <div className="user-details">
                                <span className="user-detail-item">
                                    <span className="detail-label">Age:</span>
                                    <span className="detail-value">{user.age}</span>
                                </span>
                                <span className="user-detail-divider">•</span>
                                <span className="user-detail-item">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">{user.gender}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    infoUserShow && <InfoUserComp
                        show={infoUserShow}
                        onHide={() => hideModal()}
                        user={user}
                    />
                }
            </>
    )
}