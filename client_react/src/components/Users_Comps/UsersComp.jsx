import { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UserComp } from "./UserComp"
import "../../styles/Users.css"
import AppContext from '../appContext';
import Axios from '../helpers'

export const UsersComp = () => {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.currUser);
    const token = useSelector(state => state.token);
    const users = useSelector(state => state.users);
    const [ sortSelect, setSortSelect ] = useState("fname");
    const [ sortAsc, setSortAsc ] = useState (true);
    const [showMyFriends, setShowMyFriends] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const scrollDemoRef = useRef(null);

    useEffect (() => {
        const getUsers = async () => {
            sortUsers();
        }
        getUsers();
    }, [showMyFriends, users])
    
    const sortUsers = () => {
        let tempArr = [];
        if (!showMyFriends){
            tempArr = users.toSpliced(users.findIndex((user) => user._id == currUser._id),1);
        } else {
            users.map((user) => {
                if (
                    user.FRI.findIndex(fr=>fr == currUser._id) != -1 ||
                    user.FRO.findIndex(fr=>fr == currUser._id) != -1 ||
                    user.AllFriends.findIndex(fr=>fr == currUser._id) != -1 
                ){
                    tempArr.push(user);
                }
            })
        }
        if (sortAsc) {
            tempArr.sort((a, b) => {
            if (a[sortSelect] < b[sortSelect]) {
                return -1;
            }
            if (a[sortSelect] > b[sortSelect]) {
                return 1;
            }
            return 0;
            });
        } else {
            tempArr.sort((a, b) => {
                if (a[sortSelect] < b[sortSelect]) {
                    return 1;
                }
                if (a[sortSelect] > b[sortSelect]) {
                    return -1;
                }
                return 0;
                });
        }
        setUsersList([...tempArr]);
    }

    const clearFilters = () => {
        setSortSelect("fname");
        setSortAsc(true);
        sortUsers();
    }

    const refreshUsersList = async() => {
        await Axios ("get", AppContext.USERS_URL, [token, currUser._id]).then(response=>{
            if (typeof(response) == "string") {
                alert (response);
                logoutUser("Logging out...")
            } else {
                dispatch({ type: "GET_USERS", payload: response });
            } 
        });  
    }

    return (
        <div className="users-page-container">
            <div className="users-header">
                <h1 className="users-title">Users</h1>
                <p className="users-subtitle">Connect with people in your network</p>
            </div>

            <div className="users-controls">
                <div className="filter-section">
                    <div className="checkbox-container">
                        <input
                            id="myFriendsCheck"
                            type="checkbox"
                            onChange={()=>setShowMyFriends(!showMyFriends)}
                            className="modern-checkbox"
                        />
                        <label htmlFor="myFriendsCheck" className="checkbox-label">
                            Show Friends & Friend Requests
                        </label>
                    </div>
                </div>

                <div className="sort-section">
                    <div className="sort-controls">
                        <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
                        <select
                            id="sortSelect"
                            value={sortSelect}
                            onChange={(e)=>{setSortSelect(e.target.value)}}
                            className="modern-select"
                        >
                            <option value="fname">Name</option>
                            <option value="age">Age</option>
                            <option value="gender">Gender</option>
                        </select>

                        <Button
                            variant="contained"
                            size="small"
                            className="sort-direction-btn"
                            sx={{
                                height:"2.5rem",
                                minWidth:"2.5rem",
                                width:"2.5rem",
                                borderRadius:"8px",
                                backgroundColor:"#4F46E5",
                                '&:hover': {
                                    backgroundColor: "#4338CA"
                                }
                            }}
                            onClick={()=>setSortAsc(!sortAsc)}
                        >
                            {sortAsc?<ArrowUpwardIcon/>:<ArrowDownwardIcon/>}
                        </Button>
                    </div>

                    <div className="action-buttons">
                        <button className="modern-btn primary-btn" onClick={sortUsers}>
                            Apply
                        </button>
                        <button className="modern-btn secondary-btn" onClick={clearFilters}>
                            Clear
                        </button>
                        <button
                            onClick={refreshUsersList}
                            className="modern-btn icon-btn"
                            title='Refresh Users List'
                        >
                            <RefreshIcon/>
                        </button>
                    </div>
                </div>
            </div>

            {
                usersList.length > 0 &&
                    <div className="users-grid" ref={scrollDemoRef}>
                        {
                            usersList.map((user)=>{
                                return (<UserComp user={user} key={user._id}/>);
                            })
                        }
                    </div>
            }
            {
                usersList.length === 0 &&
                    <div className="empty-state">
                        <h1>No friends to show yet...</h1>
                    </div>
            }
        </div>
    )
}