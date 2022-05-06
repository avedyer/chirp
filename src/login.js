import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "./db";


function Login(props) {

  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')))
  const [user, setUser] = useState()
  const [pfp, setPfp] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    if (login) {
      redirect().then(() => {
        props.passLogin(login);
      })
    }
    props.passLogin(null)
  }, [login])

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
    if(!pfp) {
      fetchPfp()
    }
    if (!user) {
      fetchUser()
    }
  }, [login])

  return(
    <div className="login">
      {user ? 
        <div className="userInfo">
          <img className="pfp" src={pfp}></img>
          <span className="name" onClick={() => navigateToUser()}>{user.name}</span>
          <span className="handle" onClick={() => navigateToUser()}>@{user.id}</span>
          <button onClick={() => signOutUser()}>Sign Out</button>
        </div>
        :
        <button onClick={() => signIn()}>Sign In with Google</button>
      }

    </div>
  ) 
}

export default Login