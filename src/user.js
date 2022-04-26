import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import db from './db'

function User(props) {

  const location = useLocation();
  const user = location.state.user;

  const [pfp, setPfp] = useState()
  const [banner, setBanner] = useState()
  const [isLogin, setIsLogin] = useState(() => {
    if (props.login){
      return user.email === props.login.email
    }
    return false
  })

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

  return(
    <div className="user">
      <div className='banner'>
        <label htmlFor='bannerInput'>
          <img src={banner} />
        </label>
        {
          isLogin ?
            <input id="bannerInput" type="file" style={{display: 'none'}}/>
          :
            ''
        }
      </div>
      <div className="info">
        <h1>{user.name}</h1>
        <h2>{user.id}</h2>
      </div>
    </div>
  )
}

export default User