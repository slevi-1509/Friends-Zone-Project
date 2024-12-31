import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import AppContext from './appContext';

export const Axios = (action, data) => {

    
    useEffect (() => {
        const currUser = useSelector(state => state.currUser);
        const token = useSelector(state => state.token);
        const serverURL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/users/";
        const fetchData = () => {
            console.log(createRequestHeaders(currUser.username, token))
            switch (action) {
                case "getUsers":
                    try {
                        // await axios.get(serverURL, createRequestHeaders(currUser.username, token)).then(({data:response}) => {
                        //     return response;
                        // });
                        return ("bitch")
                    } catch (error) {
                        return (error.message)
                    }            
                    break;
            
                default:
                    break;
            }
            
        }
        fetchData()
        }, []);

    
}

const createRequestHeaders = (username, token) => {
    return {
        headers: {
            "x-access-token": token,
            "Content-Type": "application/json"},
        params: {
            "username": username,
        }

    }
}