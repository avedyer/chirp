import Main from './main';
import About from './about'
import Menu from "./menu";

import { useState } from "react";
import db from './db'
import { useLocation } from 'react-router-dom';

function Home(props) {

  const [login, setLogin] = useState(props.login)

  async function fetchLoginProfile() {
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
  
  if (!login) {
    fetchLoginProfile().then(() =>{
      props.passLoginFromRedirect(login);
    })
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <Main login={login}/>
    </div>
  )
}

export default Home