import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLocationDot, faCakeCandles, faImage, faLock, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../appContext';
import Axios from '../helpers'
import "../../styles/User.css"
import "../../styles/EditUser.css"

export const EditUserComp=(props) => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const refreshUsers = useSelector(state => state.refreshUsers);
    const [user, setUser] = useState({fname: currUser.fname, lname: currUser.lname, address: currUser.address,
        age: currUser.age, email: currUser.email, imageURL: currUser.imageURL
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPasswordHint, setShowPasswordHint] = useState(false);
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
        setUser({...user, [name]: value});

        // Check password match in real-time
        if (name === 'password' || name === 'confirmPassword') {
            const pwd = name === 'password' ? value : user.password;
            const confirmPwd = name === 'confirmPassword' ? value : user.confirmPassword;
            if (pwd && confirmPwd) {
                setPasswordsMatch(pwd === confirmPwd);
            }
        }
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
                size="md"
                centered
                className="modern-edit-user-modal"
            >
                <Modal.Header closeButton className="modern-edit-header">
                    <Modal.Title className="modern-edit-title">
                        Edit Profile
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modern-edit-body">
                    <div className="edit-user-container">
                        {/* Personal Information Section */}
                        <div className="edit-section">
                            <h3 className="edit-section-title">
                                <FontAwesomeIcon icon={faUser} className="section-icon" />
                                Personal Information
                            </h3>
                            <div className="edit-form-grid">
                                <div className="form-field">
                                    <label htmlFor="fname" className="field-label">
                                        <FontAwesomeIcon icon={faUser} />
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="fname"
                                        className="modern-input"
                                        value={user.fname}
                                        onChange={setUserDetails}
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="lname" className="field-label">
                                        <FontAwesomeIcon icon={faUser} />
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lname"
                                        name="lname"
                                        className="modern-input"
                                        value={user.lname}
                                        onChange={setUserDetails}
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="age" className="field-label">
                                        <FontAwesomeIcon icon={faCakeCandles} />
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        className="modern-input"
                                        value={user.age}
                                        onChange={setUserDetails}
                                        placeholder="Enter age"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="edit-section">
                            <h3 className="edit-section-title">
                                <FontAwesomeIcon icon={faEnvelope} className="section-icon" />
                                Contact Information
                            </h3>
                            <div className="edit-form-grid">
                                <div className="form-field full-width">
                                    <label htmlFor="email" className="field-label">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="modern-input"
                                        value={user.email}
                                        onChange={setUserDetails}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label htmlFor="address" className="field-label">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="modern-input"
                                        value={user.address}
                                        onChange={setUserDetails}
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label htmlFor="imageURL" className="field-label">
                                        <FontAwesomeIcon icon={faImage} />
                                        Profile Image URL
                                    </label>
                                    <input
                                        type="text"
                                        id="imageURL"
                                        name="imageURL"
                                        className="modern-input"
                                        value={user.imageURL}
                                        onChange={setUserDetails}
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="edit-section">
                            <h3 className="edit-section-title">
                                <FontAwesomeIcon icon={faLock} className="section-icon" />
                                Change Password (Optional)
                            </h3>
                            <div className="password-hint-box">
                                <FontAwesomeIcon icon={faExclamationCircle} />
                                <span>Leave blank to keep your current password</span>
                            </div>
                            <div className="edit-form-grid">
                                <div className="form-field full-width">
                                    <label htmlFor="password" className="field-label">
                                        <FontAwesomeIcon icon={faLock} />
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="modern-input"
                                        onChange={setUserDetails}
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label htmlFor="confirmPassword" className="field-label">
                                        <FontAwesomeIcon icon={faLock} />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`modern-input ${user.password && user.confirmPassword ? (passwordsMatch ? 'valid' : 'invalid') : ''}`}
                                        onChange={setUserDetails}
                                        placeholder="Confirm new password"
                                    />
                                    {user.password && user.confirmPassword && (
                                        <div className={`password-feedback ${passwordsMatch ? 'success' : 'error'}`}>
                                            <FontAwesomeIcon icon={passwordsMatch ? faCheckCircle : faExclamationCircle} />
                                            <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="edit-actions">
                            <button className="modern-edit-btn cancel-btn" onClick={props.onHide}>
                                Cancel
                            </button>
                            <button className="modern-edit-btn save-btn" onClick={updateUser}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
  }