import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandHoldingHeart, faUserGroup, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons'
import { InfoUserComp } from './UserInfoComp'
import "../../styles/User.css"
import noImage from '../../data/noImage.png'; 


export const UserComp = ({ user }) => {
    const PORT=3300;
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const [infoUserShow, setInfoUserShow] = useState(false);
    const [frStatus, setFrStatus] = useState();
    const [frRefresh, setFrRefresh] = useState(false);

    useEffect (() => {
        // debugger;
        const getUserFR = () => {
            if (currUser._id != user._id){
                ////////// Checking if user received FRI from current user FRO /////
                if ((user.FRI.findIndex(sender => sender == currUser.username)) != -1){
                    setFrStatus (<span className="frIcon"><i><FontAwesomeIcon icon={faHandshakeSimple} title={`You sent Friend Request to ${user.fname} ${user.lname}`}/></i></span>);
                ///////// Checking if user and current user are friends (AllFriends field) //////
                } else if ((user.AllFriends.findIndex(fro => fro == currUser.username)) != -1) {
                    setFrStatus (<span className="frIcon"><i><FontAwesomeIcon icon={faUserGroup} title={`You and ${user.fname} ${user.lname} are friends!`}/></i></span>)
                //////// Checking if user sent a FR for the current user /////
                } else if ((user.FRO.findIndex(receiver => receiver == currUser.username)) != -1) {
                    setFrStatus(<span className="frIcon"><i><FontAwesomeIcon icon={faHandHoldingHeart} title={`Friend Request received from ${user.fname} ${user.lname}`}/></i></span>)
                } 
            }   
        }
        getUserFR()
    }, [frRefresh]);

    const hideModal = () => {
        setFrRefresh(!frRefresh);
        setInfoUserShow(false);
    }

    return (
        user && 
            <div id="userContainer" className="col-md-12" key={user._id}> 
                <div id="userCard" className="list-item" data-id="19" onClick={()=>setInfoUserShow(true)}>
                    <a href="#" data-abc="true"><img src={user.imageURL} style={{width:"90px", height: "90px", margin: "0 0 1rem 0.5rem"}} 
                        className="avatar gd-warning" onError={(e) => e.target.src = noImage}></img></a>
                    <div id="cardDetails" className="d-flex flex-row">
                        <div id="userName" className="d-flex flex-column">
                            <a href="#" id="item-author" className="fw-bold">{user.fname} {user.lname}</a>
                            <p className="item-except text-color">Age: {user.age}</p>
                        </div>
                        <p id="frStatus" className="no-wrap align-self-end">{frStatus}</p>
                    </div>
                </div>
                {
                    infoUserShow && <InfoUserComp 
                    show={infoUserShow}
                    onHide={() => hideModal()}
                    user={user}
                    />
                }
            </div>
    )
}