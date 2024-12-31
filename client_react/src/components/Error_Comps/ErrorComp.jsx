import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import { SpinnerComp } from "./SpinnerComp"
import sadFace from '../../data/sadface.png'; 
import "../../styles/Error.css"

// An error comp to provide a display for various errors and notifications.

export const ErrorComp = ({ errMsg }) => {
    let params = useParams();
    const [title, setTitle] = useState("");
    const [displaySpinner, setDisplaySpinner] = useState("none")

    useEffect (() => {
        const getTitle = async () => {
            if (errMsg!="" && errMsg!=undefined){
                setTitle(errMsg);
            } else {
                setTitle(params.title);
            }
        }
        getTitle();
        setDisplaySpinner("block");
    }, [params.title])

    return (
        <div id="errContainer">
            {
                params.title != null && <SpinnerComp />
            }
            <div id="errorDiv">
                <p id="errorTitle">{title}</p>
                <img id="sadFace" src={sadFace} style={{width:"100px", height:"100px"}}/>
            </div>
        </div>
    )
}