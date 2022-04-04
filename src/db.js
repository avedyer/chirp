import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

const db = (() => {

  const firebaseConfig = {
    apiKey: "AIzaSyCLyPBo2w-EWIMAc_IgIoBfDbFc6rhokI8",
    authDomain: "chirp-c0162.firebaseapp.com",
    projectId: "chirp-c0162",
    storageBucket: "chirp-c0162.appspot.com",
    messagingSenderId: "798285042162",
    appId: "1:798285042162:web:d29893866f4cd69cb71b6b",
    measurementId: "G-E5VDF5S2E5"
  };
  
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  function setPost(data) {
    const post = {...data};
    setDoc(doc(firestore, 'posts', post.id.toString()), post)
  }

  function setUser(data) {
    const user = {...data};
    setDoc(doc(firestore, 'users', user.id), user)
  }
  
  return {
    setPost,
    setUser,
  }

})()

export default db