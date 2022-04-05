import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

import { useEffect, useState } from "react";


function Login() {

  const [user, setUser] = useState()

  useEffect(() => {
    console.log(user)
  }, [user])

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
      // The signed-in user info.
      setUser(result.user)
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

  function signOutUser() {
    signOut(getAuth())
    setUser(null)
  }

  return(
    <div className="login">
      {user ? 
        <div className="userInfo">
          <p>Logged in as {user.email}</p>
          <button onClick={() => signOutUser()}>Sign Out</button>
        </div>
        :
        <button onClick={() => signIn()}>Sign In with Google</button>
      }

    </div>
  ) 
}

export default Login