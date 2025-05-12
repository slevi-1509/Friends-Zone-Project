import React, { useRef, useEffect, useState } from 'react'
import { io } from "socket.io-client"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import AppContext from './appContext';

const Axios = async (action, serverURL, userDetails, data) => {
    const requestHeader =  () => {
        return({
            headers: {
                "x-access-token": userDetails[0],
                "Content-Type": "application/json"},
            params: {
                "username":userDetails[1],
            }
        })
    }
    switch (action) {
        case "get":
            try {
                let { data: response } = await axios.get(serverURL, requestHeader())
                return (response);
            } catch (error) {
                return (error.message);
            }
            break;
        case "post":
            try {
                let { data: response } = await axios.post(serverURL, data, requestHeader())
                return (response);
            } catch (error) {
                return (error.message)
            }
            break;
        case "put":
            try {
                let { data: response } = await axios.put(serverURL, data, requestHeader())
                return (response);
            } catch (error) {
                return (error.message)
            }
            break;
        case "delete":
            try {
                let { data: response } = await axios.delete(serverURL, requestHeader())
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