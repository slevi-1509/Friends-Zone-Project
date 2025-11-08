import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate  } from "react-router-dom"
import { Stack } from "@mui/material"
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import FilledInput from "@mui/material/FilledInput"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Box from "@mui/material/Box"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope, faLocationDot, faCakeCandles, faImage, faEye, faEyeSlash, faUserPlus, faRightToBracket, faFileImport, faVenusMars, faUserTag } from '@fortawesome/free-solid-svg-icons'

import AppContext from './appContext';
import "../styles/Register.css"
import "../styles/Auth.css"

export const RegisterComp = () => {
    const authURL = AppContext.AUTH_URL+"/register";
    const [user, setUser] = useState({fname: '', lname: '', userName: '', role_name: 'User', age: 0, gender: 'Male', address: '',
         email: '', imageURL: '', password: '', confirmPassword: ''
    });
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const navigate = useNavigate();

    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setUser({...user, [name]: value})

        // Check password match in real-time
        if (name === 'password' || name === 'confirmPassword') {
            const pwd = name === 'password' ? value : user.password;
            const confirmPwd = name === 'confirmPassword' ? value : user.confirmPassword;
            if (pwd && confirmPwd) {
                setPasswordsMatch(pwd === confirmPwd);
            }
        }
    }

    // Check for proper data and registering a new user in the mongo database.
    // Password will be encrypted.
    // Create role for user base on the input.
    // Checking if Admin role exists (Only one user can be Admin)

    const registerUserFunc = async () => {
        debugger;
        if (user.userName==""||user.fname==""||user.lname==""||user.address==""||user.age==""||user.email==""||user.password==""||user.confirmPassword==""
                ||user.gender==""||user.role=="") {
                alert ('Missing information required for registration');
        } else if (!(password.value==confirmPassword.value)) {
            alert ('Passwords do not match!');
        } else {
            const newUser = {
                fname: user.fname,
                lname: user.lname,
                username: user.userName,
                role_name: user.role_name,
                age: user.age,
                gender: user.gender,
                address: user.address,
                email: user.email,
                imageURL: user.imageURL,
                password: user.password,
                actionsLeft: 100,
                lastActionTime: Date.now()
            };
            try {  
                await axios.post(authURL, newUser).then(({data:response}) => {  
                    if(response == "Admin exist") {
                        alert("Admin account already exists!\nThere can be only ONE !!!");
                        return;
                    } else if (response.includes("username_1 dup key")) {
                        alert("Error creating new account!\nUser name exist.");
                        return;
                    }
                    alert (response);
                    setDisplaySpinner("block");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                });
            } catch (error) {
                alert ("err: " + error.message);
            }
        }
        
    };

    // Import users to the database from 'client_react\src\data\users.json' file.

    const importUsers = async () => {
        let users = [];
        const usersPath = '../src/data/users.json';
        await axios.get(usersPath).then(({data:response}) => {
            users = response;
        });
        await axios.post(AppContext.AUTH_URL+"/import", users).then(({data:response}) => {
            alert ("Import of users: " + response)
        });
    }
    
    return (
        <div className="auth-page-container">
            <div className="auth-background-overlay"></div>

            {/* Import Users Button (Dev Tool) */}
            <button className="import-users-btn" onClick={importUsers}>
                <FontAwesomeIcon icon={faFileImport} />
                <span>Import Users</span>
            </button>

            <div className="auth-card-container">
                <div className="auth-card register-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">FZ</div>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join FriendZone today</p>
                    </div>

                    {/* Form */}
                    <div className="auth-form">
                        {/* Name Fields */}
                        <div className="form-row">
                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faUser} />
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="fname"
                                    className="modern-auth-input"
                                    placeholder="Enter first name"
                                    onChange={setUserDetails}
                                    required
                                />
                            </div>

                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faUser} />
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lname"
                                    className="modern-auth-input"
                                    placeholder="Enter last name"
                                    onChange={setUserDetails}
                                    required
                                />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faUser} />
                                Username
                            </label>
                            <input
                                type="text"
                                name="userName"
                                className="modern-auth-input"
                                placeholder="Choose a username"
                                onChange={setUserDetails}
                                required
                            />
                        </div>

                        {/* Role and Gender */}
                        <div className="form-row">
                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faUserTag} />
                                    Role
                                </label>
                                <select
                                    name="role_name"
                                    className="modern-auth-select"
                                    defaultValue="User"
                                    onChangeCapture={setUserDetails}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Programmer">Programmer</option>
                                    <option value="User">User</option>
                                </select>
                            </div>

                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    className="modern-auth-select"
                                    defaultValue="Male"
                                    onChangeCapture={setUserDetails}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="LGBTQ">LGBTQ</option>
                                </select>
                            </div>
                        </div>

                        {/* Age Field */}
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faCakeCandles} />
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                className="modern-auth-input"
                                placeholder="Enter your age"
                                onChange={setUserDetails}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faEnvelope} />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="modern-auth-input"
                                placeholder="Enter your email"
                                onChange={setUserDetails}
                                required
                            />
                        </div>

                        {/* Address Field */}
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faLocationDot} />
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                className="modern-auth-input"
                                placeholder="Enter your address"
                                onChange={setUserDetails}
                                required
                            />
                        </div>

                        {/* Image URL Field */}
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faImage} />
                                Profile Image URL (Optional)
                            </label>
                            <input
                                type="text"
                                name="imageURL"
                                className="modern-auth-input"
                                placeholder="Enter image URL"
                                onChange={setUserDetails}
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="form-row">
                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faLock} />
                                    Password
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="modern-auth-input"
                                        placeholder="Create password"
                                        onChange={setUserDetails}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label className="field-label">
                                    <FontAwesomeIcon icon={faLock} />
                                    Confirm Password
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`modern-auth-input ${user.password && user.confirmPassword ? (passwordsMatch ? 'valid' : 'invalid') : ''}`}
                                        placeholder="Confirm password"
                                        onChange={setUserDetails}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                {user.password && user.confirmPassword && !passwordsMatch && (
                                    <span className="password-error">Passwords do not match</span>
                                )}
                            </div>
                        </div>

                        <button className="auth-submit-btn" onClick={registerUserFunc}>
                            <FontAwesomeIcon icon={faUserPlus} />
                            <span>Create Account</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?
                            <Link to="/login" className="auth-link">
                                <FontAwesomeIcon icon={faRightToBracket} />
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {displaySpinner === "block" && <SpinnerComp />}
        </div>
    )
}