import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from "react-redux"
import { EditUserComp } from './CurrUserEditComp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen, faTrashCan, faWebAwesome } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2'
import AppContext from '../appContext';
import noImage from '../../data/noImage.png'; 
import "../../styles/Users.css"

export const UserDetailsComp = ({ logoutUserFunc, user }) => {
    const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/users/";
    const token = useSelector(state => state.token);
    const [modalShow, setModalShow] = useState(false);
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": user.username,
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
                    await axios.delete(serverURL+"/"+user._id, params).then(({data:response}) => {
                        if (response == "User deleted successfully!") {
                            Swal.fire('Profile Deleted. Good bye!', '', 'success');
                            logoutUserFunc("Goodbye Bitch !!!");
                        }
                    });
                } catch (error) {
                    alert (error.message);
                }
            };
        });
    };

    return (
        <div>
            <div id="currUserCard" className="list-item" data-id="19">
                <div className="d-flex flex-column">
                    <div id="adminIcon" title="Admin">{user.role_name=="Admin" && <FontAwesomeIcon icon={faWebAwesome}/>}</div>                     
                    <a href="#" data-abc="true"><img src={user.imageURL} style={{width:"90px", height: "90px", margin: "0 0 1rem 0.5rem"}} 
                        className="avatar gd-warning" onError={(e) => e.target.src = noImage}></img></a>
                </div>
                <div className="d-flex flex-row">
                    <div id="currUserName" className="d-flex flex-column">
                        <a href="#" className="userDetails item-author text-color fw-bold fs-4" data-abc="true">{user.fname} {user.lname}</a>
                        <p className="userDetails item-except fs-4">Age: {user.age}</p>
                        <p className="userDetails fs-5">{user.email}</p>
                        <p className="userDetails fs-5">{user.address}</p>
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
                user={user}
            />
            }
        </div>
    )
}