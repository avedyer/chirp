import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import db from './db'

function Post(props) {

  const navigate = useNavigate()

  const [user, setUser] = useState();
  const [pfp, setPfp] = useState();

  useEffect(() => {
    async function fetchUser() {
      const userList = await db.getUsers({id: props.post.user});
      setUser(userList[0])
    }
    if (!user) {
      fetchUser()
    }
  }, [])

  useEffect(() => {
    async function fetchPfp() {
      try {
        const url = await db.getPfpUrl(user.pfp);
        setPfp(url)
      }
      catch(err) {
        const url = await db.getPfpUrl('default-user', 'png');
        setPfp(url)
      }
    }
    if(user && !pfp) {
      fetchPfp()
    }
  }, [user])

  function navigateToUser() {
    console.log('navigating')
    navigate(`/user/${props.post.user}`, {
      state: {
        user: user
      }
    })
  }

  return(
    
    user ?

    <div className="post">
      <div className="sidebar">
        <img className="pfp" src={pfp}></img>
      </div>
      <div className="content">
        <div className="topline">
          <div className="info">
            <span className="name" onClick={() => navigateToUser()}>{user.name}</span>
            <span className="handle" onClick={() => navigateToUser()}>@{props.post.user}</span>
            <span className="time"></span>
          </div>
          <div className="options"></div>
        </div>
        <div className="text">
          <p>{props.post.text}</p>
        </div>
        <div className="metrics">
          <div className="reply"></div>
          <div className="repost"></div>
          <div className="like"></div>
        </div>
      </div>
    </div>

    :

    'loading...'
  )
}

export default Post