import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import db from "./db";


function Login(props) {

  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')))
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

  return(
    <div className="login">
      {login ? 
        <div className="userInfo">
          <p>Logged in as {login.email}</p>
          <button onClick={() => signOutUser()}>Sign Out</button>
        </div>
        :
        <button onClick={() => signIn()}>Sign In with Google</button>
      }

    </div>
  ) 
}

export default Login