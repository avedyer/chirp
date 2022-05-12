import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import db from './db'
import Feed from './feed';

function User(props) {

  const location = useLocation();

  const [pfp, setPfp] = useState()
  const [banner, setBanner] = useState()
  const [login, setLogin] = useState()
  const [user, setUser] = useState()
  const [isLogin, setIsLogin] = useState()
  const [following, setFollowing] = useState()

  useEffect(() => {
    if (!user || !login) {
      if (location.state) {
        setLogin(location.state.login);
        setUser(location.state.user);
      }
      else {
        getInfoByUrl()
      }
    }
  }, [])

  async function getInfoByUrl() {
    const url = window.location.href
    const exts = url.split('/')
    const id = exts[exts.length - 1]

    const userArray = await db.getUsers({id: id});
    setUser(userArray[0])

    const storedLogin = JSON.parse(localStorage.getItem('login'));
    const loginArray = (await db.getUsers({email: storedLogin.email}));
    setLogin(loginArray[0])
  }

  useEffect(() => {
    if (login && user) {
      setFollowing(login.following.includes(user.id))
      setIsLogin(login.email === user.email)
    }
  }, [login])

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

    async function fetchBanner() {
      try {
        const url = await db.getBannerUrl(user.pfp);
        setBanner(url)
      }
      catch(err) {
        const url = await db.getBannerUrl('default-banner', 'jpg');
        setBanner(url)
      }
    }

    if(user && !pfp) {
      fetchPfp()
    }
    if(user && !banner) {
      fetchBanner()
    }
  }, [user])

  function handleFollow() {
    setFollowing(!following)
    db.toggleFollow(user, login)
  }

  if (user && login) {
    return (
      <div className="user">
        <div className={`banner ${isLogin ? 'editable' : ''}`}>
          <img src={banner} />
          <label htmlFor='bannerInput' className='edit-prompt'><span>Change Banner</span></label>
          {
            isLogin ?
              <input id="bannerInput" type="file" style={{display: "none"}}/>
            :
              ''
          }
        </div>
        <div className="info">
          <h1>{user.name}</h1>
          <h2>{user.id}</h2>
        </div>
        {
          isLogin ?
          ''
          :
          <button onClick={handleFollow}>{following ? 'Following' : 'Follow'}</button>
        }
        <Feed login={props.login} params={{user: user.id}} />
      </div>
    )
  }

  else {
    return (
      <p>loading...</p>
    )
  }
}

export default User