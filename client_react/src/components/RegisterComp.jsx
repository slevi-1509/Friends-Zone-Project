import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate  } from "react-router-dom"
import { Stack } from "@mui/material"
import { SpinnerComp } from "./Error_Comps/SpinnerComp"
import FilledInput from "@mui/material/FilledInput"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Box from "@mui/material/Box"

import AppContext from './appContext';
import "../styles/Register.css"

export const RegisterComp = () => {
    const authURL = AppContext.AUTH_URL+"/register";
    const [user, setUser] = useState({fname: '', lname: '', userName: '', role_name: 'User', age: 0, gender: 'Male', address: '', 
         email: '', imageURL: '', password: '', confirmPassword: ''
    });
    const [displaySpinner, setDisplaySpinner] = useState("none")
    const navigate = useNavigate();

    const setUserDetails = (e) => {
        let { value, name } = e.target;
        setUser({...user, [name]: value})
    }

    // Check for proper data and registering a new user in the mongo database.
    // Password will be encrypted.
    // Create role for user base on the input.
    // Checking if Admin role exists (Only one user can be Admin)

    const registerUserFunc = async () => {
        debugger;
        if (user.userName==""||user.fname==""||user.lname==""||user.address==""||user.age==""||user.email==""||user.password==""||user.confirmPassword==""
                ||user.gender==""||user.role=="") {
                alert ('Missing information required for registration');
        } else if (!(password.value==confirmPassword.value)) {
            alert ('Passwords do not match!');
        } else {
            const newUser = {
                fname: user.fname,
                lname: user.lname,
                username: user.userName,
                role_name: user.role_name,
                age: user.age,
                gender: user.gender,
                address: user.address,
                email: user.email,
                imageURL: user.imageURL,
                password: user.password,
                actionsLeft: 100,
                lastActionTime: Date.now()
            };
            try {  
                await axios.post(authURL, newUser).then(({data:response}) => {  
                    if(response == "Admin exist") {
                        alert("Admin account already exists!\nThere can be only ONE !!!");
                        return;
                    } else if (response.includes("username_1 dup key")) {
                        alert("Error creating new account!\nUser name exist.");
                        return;
                    }
                    alert (response);
                    setDisplaySpinner("block");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                });
            } catch (error) {
                alert ("err: " + error.message);
            }
        }
        
    };

    // Import users to the database from 'client_react\src\data\users.json' file.

    const importUsers = async () => {
        let users = [];
        const usersPath = '../src/data/users.json';
        await axios.get(usersPath).then(({data:response}) => {
            users = response;
        });
        await axios.post(AppContext.AUTH_URL+"/import", users).then(({data:response}) => {
            alert ("Import of users: " + response)
        });
    }
    
    return (
        <div id="registerContainer">
            <button id="importUsersBtn" onClick={importUsers}>Import Users</button>
            {displaySpinner=="block" && <SpinnerComp />}
            <h1 id="registerTitle"><span>Register to FriendZone</span></h1>
            <Stack spacing={1} direction="column">
            {/* <div id="userNameDiv" className="d-flex flex-row"> */}
                <Stack spacing={1} direction="row">
                    <input type="text" id="fname" name="fname" placeholder="First Name" onChange={setUserDetails} required/>
                    <input type="text" id="lname" name="lname" placeholder="Last Name" onChange={setUserDetails} required/>
                </Stack>
                <Stack spacing={1} direction="row">
                    <input type="text" name="userName" placeholder="User Name" onChange={setUserDetails} required/>
                    <label htmlFor="userRoleSelect">Role:</label>
                    <select id="userRoleSelect" defaultValue="User" name="role_name" onChangeCapture={setUserDetails}>
                        <option value="Admin">Admin</option>
                        <option value="Programmer">Programmer</option>
                        <option value="User">User</option>
                    </select>
                </Stack>
                {/* </div> */}
                <Stack spacing={1} direction="row">
                    <input type="number" id="age" name="age" placeholder="Age" onChange={setUserDetails} required/>     
                    <label htmlFor="userGenderSelect">Gender:</label>
                    <select id="userGenderSelect" defaultValue="Male" name="gender" onChangeCapture={setUserDetails} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="LGBTQ">LGBTQ</option>
                    </select>                
                </Stack>
                <input type="text" id="address" name="address" placeholder="Address" onChange={setUserDetails} required/>
                <input type="email" id="email" name="email" placeholder="Email" onChange={setUserDetails} required/>
                <input type="text" id="imageURL" name="imageURL" placeholder="Image URL" onChange={setUserDetails}/>
                <Stack spacing={1} direction="row">
                    <input type="password" id="password" name="password" placeholder="Password" onChange={setUserDetails} required/>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={setUserDetails} required/>
                </Stack>
                {/* <div id="fullName"> */}
                {/* <FormControl variant="filled">
                    <InputLabel htmlFor="fname">First Name:</InputLabel>
                    <FilledInput
                        id="fname"
                        defaultValue="" 
                        name="fname" 
                        onChange={setUserDetails} 
                        required
                    />
                </FormControl>
                <FormControl variant="filled">
                    <InputLabel htmlFor="lname">Last Name:</InputLabel>
                    <FilledInput
                        id="lname"
                        defaultValue="" 
                        name="lname" 
                        onChange={setUserDetails} 
                        required
                    />
                </FormControl> */}
            </Stack>
                    {/* <input type="text" id="fname" name="fname" placeholder="First Name" onChange={setUserDetails} required/> */}
                    {/* <input type="text" id="lname" name="lname" placeholder="Last Name" onChange={setUserDetails} required/> */}
                {/* </div> */}
                
            <div className="registerBtns">
                <button id="registerBtn" className="btn" onClick={() => registerUserFunc()}>Register</button>
            </div>
            <section id="loginPage">
                <span>Already registered? </span>
                <Link id="loginLink" to={'/login'}>Login</Link>
            </section>
        </div>
    )
}