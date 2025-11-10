import React, { useState } from 'react'
import axios from 'axios'
import { io } from "socket.io-client"
import { CookiesProvider, useCookies } from 'react-cookie'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import { Button, TextField, FormControl, Stack } from "@mui/material"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEye, faEyeSlash, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import AppContext from './appContext';
import Axios from './helpers'
import "../styles/LogIn.css"
import "../styles/Auth.css"

export const LoginComp = () => {
    const authURL = AppContext.AUTH_URL+"/login";
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [userLogin, setUserLogin] = useState({username: '', password: ''})
    const [showPassword, setShowPassword] = useState(false)
    const [cookies, setCookie] = useCookies([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setUserLogin({...userLogin, [name]: value})
        // console.log(userLogin)
    }

     // Check for login name and passwaord and in case of approval creates a cookie with the token.
     // Updates the reducers parameters.

    const onFormSubmit = async () => {
        // console.log("render login")
        // debugger;
        if (userLogin.username == "" || userLogin.password == ""){
            alert ("Missing username or password!");
            return;
        } else {
            try { 
                setDisplaySpinner("block");
                await Axios("post", authURL, "", {username: userLogin.username, password: userLogin.password}).then((response=>{
                    if (typeof response == "string"){
                        alert(response);
                    } else {
                        setCookie(response.user._id, response.token, {
                            path: "/",
                            secure: false,
                            sameSite: "strict",
                            // maxAge: 36000,
                          }); 
                        dispatch({ type: "GET_CURRUSER", payload: response.user });
                        dispatch({ type: "GET_TOKEN", payload: response.token });
                        // dispatch({ type: "GET_SOCKET", payload: io (AppContext.SERVER_IP+AppContext.HTTP_PORT) });
                        
                        // setDisplaySpinner("block");
                        navigate("/main");
                        // setTimeout(() => {
                        //     navigate("/main");
                        // }, 1000);
                    }
                }))
            } catch (e) {
                alert ("Something went wrong with login request:\n" + e.message +
                    ", Probably server is not reachable."
                );
            }
        }    
    }

    return (
        <div className="auth-page-container">
            <div className="auth-background-overlay"></div>

            <div className="auth-card-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">FZ</div>
                        </div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue to FriendZone</p>
                    </div>

                    {/* Form */}
                    <div className="auth-form">
                        <div className="form-field-group">
                            <label className="field-label">
                                <FontAwesomeIcon icon={faUser} />
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="modern-auth-input"
                                placeholder="Enter your username"
                                onChange={setUserDetails}
                                required
                            />
                        </div>

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
                                    placeholder="Enter your password"
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

                        <button className="auth-submit-btn" onClick={onFormSubmit}>
                            <FontAwesomeIcon icon={faRightToBracket} />
                            <span>Sign In</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an account?
                            <Link to="/register" className="auth-link">
                                <FontAwesomeIcon icon={faUserPlus} />
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {displaySpinner === "block" && <SpinnerComp />}
        </div>
    )
}