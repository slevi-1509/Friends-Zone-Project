import React, { useState } from 'react'
import axios from 'axios'
import { io } from "socket.io-client"
import { CookiesProvider, useCookies } from 'react-cookie'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import { Button, TextField, FormControl, Stack } from "@mui/material"
// import Button from "@mui/material/Button"
// import TextField from "@mui/material/TextField"
// import FormControl from "@mui/material/FormControl"
// import Stack from "@mui/material/Stack"
import AppContext from './appContext';
import Axios from './helpers'
import "../styles/logIn.css"

export const LoginComp = () => {
    const authURL = AppContext.AUTH_URL+"/login";
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [userLogin, setUserLogin] = useState({username: '', password: ''})
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
                        
                        setDisplaySpinner("block");
                        setTimeout(() => {
                            navigate("/main");
                        }, 1000);
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
        <div id="loginContainer">
            <div id="loginBody">
                <h1 id="loginTitle"><span>Login to FriendZone</span></h1>
                {/* <input type="text" id="username" name="username" placeholder="Username" onChange={setUserDetails} required/> */}
                <FormControl variant="filled">
                    <TextField
                        // id="outlined-uncontrolled"
                        label="User Name:"
                        defaultValue=""
                        name="username"
                        onChange={setUserDetails} 
                        required
                        sx={{
                            mb: "1rem"
                        }}
                    />
                    <TextField
                        // id="outlined-uncontrolled"
                        label="Password:"
                        defaultValue=""
                        name="password"
                        onChange={setUserDetails} 
                        type="password"
                        required
                        sx={{
                            mb: "1rem",
                        }}
                    />
                    {/* <input type="password" id="password" name="password" placeholder="Password" onChange={setUserDetails} required/> */}
                    {/* <button id="logInBtn" className="btn" onClick={() => loginUserFunc()}>Login</button> */}
                    <Button 
                        // type="submit"
                        variant="contained" 
                        size="large" 
                        onClick={onFormSubmit}
                        sx={{
                            fontSize: "1.2rem",
                        }} 
                    >
                    Login
                    </Button>
                </FormControl>
                <section id="registerPage">
                    <span>Not registered? </span>
                    <Link id="registerLink" to={'/register'}>Register</Link>
                </section>
            </div>
            {displaySpinner=="block" && <SpinnerComp />}
        </div>
    )
}