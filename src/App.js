import { Routes, Route, BrowserRouter } from "react-router-dom";

import './App.css';


import Home from "./home";
import User from "./user";
import Signup from "./signup";
import Thread from "./thread";

import db from "./db";

import { useEffect, useState } from "react";

function App() {

  const [login, setLogin] = useState()

  async function fetchLoginProfile(login) {
    if(login) {
      const userList = (await db.getUsers({email: login.email}))
      setLogin(userList[0]);
    }
    else {
      const storedLogin = JSON.parse(localStorage.getItem('login'));
      if (storedLogin) {
        const userList = (await db.getUsers({email: storedLogin.email}));
        setLogin(userList[0])
      }
      else {
        setLogin({
          email: '',
          id: '',
          name: '',
          bio: '',
          private: '',
          pfp: '', 
          banner: '',
          followers: [],
          following: [],
          likes: []
        })
      }
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home login={login} passLogin={fetchLoginProfile}/>}/>
          <Route exact path='/user/:id' element={<User login={login}/>}/>
          <Route exact path='/thread/:id' element={<Thread />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
