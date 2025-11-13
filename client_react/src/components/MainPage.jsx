import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import { SocketChatComp } from "./Socket_Comps/SocketChatComp"
import { EditUserComp } from './Users_Comps/CurrUserEditComp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen, faTrashCan, faUsers, faNewspaper, faComments, faRightFromBracket, faCrown } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Swal from 'sweetalert2'
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import AppContext from './appContext';
import noImage from '../data/noImage.png';
import Axios from './helpers'
import '../styles/MainPage.css'

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const socket = useSelector(state => state.socket);
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const [showChat, setShowChat] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [cookies] = useCookies({});

    useEffect (() => {
        const getUserData = async () => {
            if (token=="") {
                if (Object.keys(cookies).length > 0){
                    try {
                        let myUserId = Object.keys(cookies)[Object.keys(cookies).length-1];
                        let myToken = Object.values(cookies)[Object.values(cookies).length-1];
                        let response = await Axios ("get", AppContext.USERS_URL, [myToken, myUserId])
                        if (typeof(response) == "string") {
                            alert (response);
                            logoutUser("Logging out...")
                        } else {
                            dispatch({ type: "GET_USERS", payload: response });
                            dispatch({ type: "GET_CURRUSER", payload: response.find(user=>{return user._id == myUserId}) });
                            dispatch({ type: "GET_TOKEN", payload: myToken });
                            await Axios ("get", AppContext.POSTS_URL, [myToken, myUserId]).then((allPosts)=>{
                                if (typeof(allPosts) !== "string") {
                                    dispatch({ type: "GET_POSTS", payload: allPosts });
                                }  
                            })
                        }
                    } catch (error) {
                        navigate("/error/"+"No Credentials were found, Back to login!");
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    } 
                } else {
                    navigate("/error/"+"No Credentials were found, Back to login!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } 
            } else {
                let response = await Axios ("get", AppContext.USERS_URL, [token, currUser._id]);
                if (typeof(response) == "string") {
                    alert (response);
                    logoutUser("Logging out...")
                } else {
                    dispatch({ type: "GET_USERS", payload: response });
                    await Axios ("get", AppContext.POSTS_URL, [token, currUser._id]).then((allPosts)=>{
                        if (typeof(allPosts) !== "string") {
                            dispatch({ type: "GET_POSTS", payload: allPosts });
                        }  
                    })
                    navigate("/main/users");
                } 
            }
        }
        getUserData();
    }, [])

    const logoutUser = async (title) => {
        try {
            await Axios ("logout", AppContext.SERVER_IP+AppContext.APP_PORT+"/logout")
            setDisplaySpinner("block");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.log ('Error logging out:', err);
            return (new Error('Error logging out'));
        }
    }
    
    const deleteMyProfile = () => {
        Swal.fire({
            title: `Deleting your profile. Continue?`,
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
            actions: 'my-actions',
            confirmButton: 'order-1',
            denyButton: 'order-2',
            
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Axios ("delete", AppContext.USERS_URL+"/"+currUser._id, [token, currUser._id]).then((response) => {
                        if (response == "User deleted successfully!") {
                            Swal.fire('Profile Deleted. Good bye!', '', 'success');
                            logoutUser("Goodbye!!!");
                        }
                    });
                } catch (error) {
                    alert (error.message);
                }
            };
        });
    };

    return (
        <div className="main-page-container">
            {/* Modern Navigation Header */}
            <header className="main-header">
                <div className="header-content">
                    <div className="brand-section">
                        <h1 className="brand-title">FriendZone</h1>
                        <p className="brand-subtitle">Connect. Share. Engage.</p>
                    </div>

                    <nav className="main-navigation">
                        <NavLink
                            to={'users'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <FontAwesomeIcon icon={faUsers} />
                            <span>Users</span>
                        </NavLink>
                        <NavLink
                            to={'posts'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <FontAwesomeIcon icon={faNewspaper} />
                            <span>Posts</span>
                        </NavLink>
                        <button className="nav-link nav-button" onClick={()=>setShowChat(true)}>
                            <FontAwesomeIcon icon={faComments} />
                            <span>Chat</span>
                        </button>
                        <button className="nav-link nav-button logout-btn" onClick={()=>logoutUser("Logging out...\nSorry to see you go")}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="main-content-wrapper">
                {/* Sidebar - Current User Profile */}
                <aside className="sidebar-profile">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            {currUser.role_name === "Admin" && (
                                <div className="admin-badge">
                                    <FontAwesomeIcon icon={faCrown} />
                                    <span>Admin</span>
                                </div>
                            )}
                        </div>

                        <div className="profile-card-body">
                            <div className="profile-avatar-section">
                                <img
                                    src={currUser.imageURL}
                                    className="profile-avatar-main"
                                    alt={`${currUser.fname} ${currUser.lname}`}
                                    onError={(e) => e.target.src = noImage}
                                />
                            </div>

                            <div className="profile-info-section">
                                <h2 className="profile-name">{currUser.fname} {currUser.lname}</h2>

                                <div className="profile-details">
                                    <div className="profile-detail-item">
                                        <span className="detail-icon">🎂</span>
                                        <span className="detail-text">Age: {currUser.age}</span>
                                    </div>
                                    <div className="profile-detail-item">
                                        <span className="detail-icon">📧</span>
                                        <span className="detail-text">{currUser.email}</span>
                                    </div>
                                    <div className="profile-detail-item">
                                        <span className="detail-icon">📍</span>
                                        <span className="detail-text">{currUser.address}</span>
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <Tooltip title={<span style={{fontSize:"0.875rem"}}>Edit my profile</span>}>
                                        <button className="profile-action-btn edit-btn" onClick={() => setModalShow(true)}>
                                            <FontAwesomeIcon icon={faUserPen} />
                                            <span>Edit Profile</span>
                                        </button>
                                    </Tooltip>
                                    <Tooltip title={<span style={{fontSize:"0.875rem"}}>Delete my profile</span>}>
                                        <button className="profile-action-btn delete-btn" onClick={() => deleteMyProfile()}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                            <span>Delete</span>
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <Outlet/>
                </main>
            </div>

            {/* Modals */}
            {
                modalShow && <EditUserComp
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            }
            {
                showChat && <SocketChatComp
                    show={showChat}
                    onHide={()=>setShowChat(false)}
                />
            }
            {displaySpinner === "block" && <SpinnerComp />}
        </div>
    )
}