import React, { useState } from 'react'
import axios from 'axios'
import { io } from "socket.io-client"
import { CookiesProvider, useCookies } from 'react-cookie'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import AppContext from './appContext';
import "../styles/logIn.css"

export const LoginComp = () => {
    const authURL = AppContext.AUTH_URL+"/login";
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [userLogin, setUserLogin] = useState({userName: '', password: ''})
    const [cookies, setCookie] = useCookies([]);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setUserLogin({...userLogin, [name]: value})
    }

     // Check for login name and passwaord and in case of approval creates a cookie with the token.
     // Updates the reducers parameters.

    const loginUserFunc = async () => {
        if (userLogin.userName == "" || userLogin.password == ""){
            alert ("Missing username or password!");
            return;
        } else {
            try { 
                let {data: response} = await axios.post(authURL, {username: username.value, password: password.value})
                if (typeof response == "string"){
                    alert(response);
                } else {
                    setCookie(userLogin.userName, response.token, {
                        path: "/",
                        secure: false,
                        sameSite: "strict",
                        maxAge: 36000,
                      }); 
                    dispatch({ type: "GET_CURRUSER", payload: response.user });
                    dispatch({ type: "GET_TOKEN", payload: response.token });
                    dispatch({ type: "GET_SOCKET", payload: io (AppContext.SERVER_IP+AppContext.HTTP_PORT) });
                    
                    setDisplaySpinner("block");
                    setTimeout(() => {
                        navigate("/users");
                    }, 1000);
                }
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
                <input type="text" id="username" name="userName" placeholder="Username" onChange={setUserDetails} required/>
                <input type="password" id="password" name="password" placeholder="Password" onChange={setUserDetails} required/>
                <button id="logInBtn" className="btn" onClick={() => loginUserFunc()}>Login</button>
                <section id="registerPage">
                    <span>Not registered? </span>
                    <Link id="registerLink" to={'/register'}>Register</Link>
                </section>
            </div>
            {displaySpinner=="block" && <SpinnerComp />}
        </div>
    )
}