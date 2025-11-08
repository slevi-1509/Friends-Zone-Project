import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import "../../styles/Spinner.css"

export const SpinnerComp = ({ message = "Loading", variant = "default" }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="modern-spinner-overlay">
            <div className="modern-spinner-container">
                {variant === "default" && (
                    <div className="spinner-wrapper">
                        {/* Main Spinner Ring */}
                        <div className="spinner-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )}

                {variant === "dots" && (
                    <div className="spinner-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}

                {variant === "pulse" && (
                    <div className="spinner-pulse">
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                    </div>
                )}

                {variant === "gradient" && (
                    <div className="spinner-gradient">
                        <div className="gradient-ring"></div>
                    </div>
                )}

                {/* Loading Text */}
                <div className="spinner-text">
                    <span className="loading-message">{message}{dots}</span>
                    <span className="loading-subtitle">Please wait</span>
                </div>
            </div>
        </div>
    )
}