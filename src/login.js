import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "./db";


function Login(props) {

  const [login, setLogin] = useState()
  const [user, setUser] = useState()
  const [pfp, setPfp] = useState()
  const navigate = useNavigate()

  async function signIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      localStorage.setItem('login', JSON.stringify(result.user));
      // The signed-in user info.
      setLogin(result.user);
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
    
  }

  async function redirect() {
    const userList = (await db.getUsers({email: login.email}))
    if(userList.length === 0) {
      navigate('/signup', {
        state: {
          email: login.email
        }
      })
    }
  }

  function signOutUser() {
    signOut(getAuth())
    localStorage.removeItem('login')
    setLogin(null)
  }

  function navigateToUser() {
    navigate(`/user/${user.id}`, {
      state: {
        user: user,
        login: user,
      }
    })
  }


  useEffect(() => {

    if(!login) {
      setLogin(JSON.parse(localStorage.getItem('login')))
    }
    
    if(login) {
      redirect().then(() => {
        props.passLogin(login);
      })
    }
  
    if(!pfp) {
      fetchPfp()
    }
    if (login && !user) {
      fetchUser()
    }
    else {
      setUser(null)
    }

    async function fetchUser() {
      const userList = await db.getUsers({email: login.email})
      console.log(userList[0])
      setUser(userList[0])
    }
    
    async function fetchPfp() {
      try {
        const url = await db.getPfpUrl(login.pfp);
        setPfp(url)
      }
      catch(err) {
        const url = await db.getPfpUrl('default-user', 'png');
        setPfp(url)
      }
    }
  }, [login])

  return(
    <div className="login">
      {user ? 
        <div className="user-menu">
          <div className="user-info">
            <div className="sidebar">
              <img className="pfp" src={pfp}></img>
            </div>
            <div className="main">
              <div className="id-container">
                <div>
                  <span className="name" onClick={() => navigateToUser()}>{user.name}</span>
                </div>
                <div>
                  <span className="handle" onClick={() => navigateToUser()}>@{user.id}</span>  
                </div>
              </div>

              <button onClick={() => signOutUser()}>Sign Out</button>
            </div>
          </div>
        </div>
        :
        <button onClick={() => signIn()}>Sign In with Google</button>
      }

    </div>
  ) 
}

export default Login