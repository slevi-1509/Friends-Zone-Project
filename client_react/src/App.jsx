import './App.css'
import { Routes, Route } from "react-router-dom"
import { UsersComp } from "./components/Users_Comps/UsersComp"
import { PostsComp } from "./components/Posts_Comps/PostsComp"
import { MainPage } from "./components/MainPage"
import { LoginComp } from "./components/LoginComp"
import { RegisterComp } from "./components/RegisterComp"
import { ErrorComp } from "./components/Error_Comps/ErrorComp"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import AppContext from './components/appContext';

function App() {

  AppContext.APP_PORT = 3300;
  AppContext.HTTP_PORT = 3301;
  // AppContext.SERVER_IP = "https://localhost:";
  // AppContext.SERVER_IP = "https://54.166.160.8:";
  AppContext.SERVER_IP = "https://myaws1509.ddns.net:";
  AppContext.AUTH_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/auth";
  AppContext.USERS_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/users";
  AppContext.POSTS_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts";
  AppContext.MESSAGES_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/messages";

  return (
    <div className="appBody">
      <Routes>
        <Route path='/' element={<LoginComp />} />
        <Route path='/login' element={<LoginComp />} />
        <Route path='/register' element={<RegisterComp />} />
        <Route path="/main" element={<MainPage />} >
          <Route path="users" element={<UsersComp />} />
          <Route path="posts" element={<PostsComp />} />
        </Route>
        <Route
          path='/error/:title' element = {<ErrorComp/>}
        />    
      </Routes>
    </div>
  )
}

export default App


    
