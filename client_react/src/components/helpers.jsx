import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import AppContext from './appContext';

const Axios = async (action, serverURL, headerParams, data) => {
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
    switch (action) {
        case "get":
            try {
                let { data: response } = await axios.get(serverURL, createRequestHeaders(headerParams[0],headerParams[1]), data)
                return (response);
            } catch (error) {
                return (error.message)
            }
            break;
        case "post":
            try {
                let { data: response } = await axios.post(serverURL, createRequestHeaders(headerParams[0],headerParams[1]), data)
                return (response);
            } catch (error) {
                return (error.message)
            }
            break;
        case "logout":
            try {
                let { data: response } = await axios.post(AppContext.SERVER_IP+AppContext.APP_PORT+"/logout")
                return (response);
            } catch (error) {
                return (error.message)
            }
            break;
        default:
          // code block
      }
}

export default Axios;