import Main from './main';
import About from './about'
import Menu from "./menu";

import { useState } from "react";
import { useLocation } from 'react-router-dom';

function Home(props) {

  const [login, setLogin] = useState(props.login)

  return (
    <div className="home">
      <h1>Home</h1>
      <Main login={props.login}/>
    </div>
  )
}

export default Home