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

  const [pfp, setPfp] = useState()

  useEffect(() => {
    async function fetchPfp() {
      try {
        const url = await db.getPfpUrl(props.login.pfp);
        setPfp(url)
      }
      catch(err) {
        const url = await db.getPfpUrl('default-user', 'png');
        setPfp(url)
      }
    }
    if(!pfp) {
      fetchPfp()
    }
  }, [])

  return (
    <div className="menu">
      <Logo className="logo" onClick={navigateToHome} />
      <Login passLogin={props.passLogin}/>
    </div>
  )
}

export default Menu