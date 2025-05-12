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
  // AppContext.SERVER_IP = "http://192.168.1.94:";
  // AppContext.SERVER_IP = "http://77.137.66.52:";
  AppContext.SERVER_IP = "http://localhost:";
  AppContext.AUTH_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/auth";
  AppContext.USERS_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/users";
  AppContext.POSTS_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/posts";
  AppContext.MESSAGES_URL = AppContext.SERVER_IP+AppContext.APP_PORT+"/api/messages";
  AppContext.OPENAI_API_KEY = "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"

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


    
