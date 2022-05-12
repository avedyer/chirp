import Login from "./login"

import { ReactComponent as Logo } from './imgs/logo.svg'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import db from "./db";

function Menu(props) {

  const navigate = useNavigate();

  function navigateToHome() {
    navigate(`/`, {
      state: {
        login: props.login
      }
    })
  }

  return (
    <div className="menu">
      <Logo className="logo" onClick={navigateToHome} />
      <Login passLogin={props.passLogin}/>
    </div>
  )
}

export default Menu