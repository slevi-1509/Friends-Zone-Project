import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import AppContext from '../appContext';
import Axios from '../helpers'
import "../../styles/User.css"

export const EditUserComp=(props) => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshUsers = useSelector(state => state.refreshUsers);
    // const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/users/";
    const [user, setUser] = useState({fname: currUser.fname, lname: currUser.lname, address: currUser.address, 
        age: currUser.age, email: currUser.email, imageURL: currUser.imageURL
    });
    const params = {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": currUser.username,
        }
    }

    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setUser({...user, [name]: value})
    }

    const updateUser = async () => {
        if (user.fname==""||user.lname==""||user.address==""||user.age==""||user.email=="") {
            alert ('Missing information required for updating!');
        } else if (!(user.password==user.confirmPassword)) {
            alert ('Passwords do not match!');
        } else {
            if (!(user.password==undefined && user.confirmPassword==undefined)){
                setUser({...user, password: user.password})
            }
            try {
                await Axios ("put", AppContext.USERS_URL+"/"+currUser._id, user, params).then((response) => {
                    dispatch({ type: "GET_USERS", payload: response });
                    props.onHide();
                });
                // await axios.put(AppContext.USERS_URL+"/"+currUser._id, user, params).then(({data:response}) => {
                //     dispatch({ type: "GET_USERS", payload: response });
                //     // dispatch({ type: "REFRESH_USERS", payload: !refreshUsers });
                //     // alert(response);
                //     props.onHide();
                // });
            } catch (error) {
                alert(error.message);
                return error;
            }
        };
    };   

    return (
        <div>
            <Modal 
                {...props}
                size="sm"
                centered
            >
                <div id="editUserModal"> 
                    <Modal.Header id="editProfileHeader" closeButton> 
                            <h4>Profile of {currUser.fname} {currUser.lname}</h4>
                    </Modal.Header>
                    
                    <Modal.Body id="userProfile">
                        <label htmlFor="fname">First Name:</label>
                        <input type="text" id="fname" name="fname" value={user.fname} onChange={setUserDetails} required/>
                        <label htmlFor="lname">Last Name:</label>
                        <input type="text" id="lname" name="lname" value={user.lname} onChange={setUserDetails} required/>
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" value={user.address} onChange={setUserDetails} required/>
                        <label htmlFor="age">Age:</label>
                        <input type="number" id="age" name="age" value={user.age} onChange={setUserDetails} required/>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={user.email} onChange={setUserDetails} required/>
                        <label htmlFor="imageURL">Image URL:</label>
                        <input type="text" id="imageURL" name="imageURL" value={user.imageURL} onChange={setUserDetails}/>
                        <input className="mt-2 mb-1" type="password" id="password" name="password" placeholder="Password" onChange={setUserDetails} required/>
                        <input className="mb-2"type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"onChange={setUserDetails} required/>
                        <label>To keep old password,<br></br>leave password fields blank !</label>
                        <button id="updateUserBtn" className="btn" onClick={() => updateUser()}>Update</button>
                    </Modal.Body>
                    
                    <div></div>
                </div> 
            </Modal>
        </div>
    );
  }