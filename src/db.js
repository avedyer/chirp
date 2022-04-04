import { collection, getDocs, getFirestore } from "firebase/firestore"
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

  async function getUsers(params) {

    const userCollection = collection(firestore, 'users');
    const userSnapshot = await getDocs(userCollection);
    let userList = userSnapshot.docs.map(doc => doc.data())

    Object.keys(params).forEach((param) => {
      if (Object.keys(userList).includes(param)) {
        userList.forEach((user, index) => {
          if (user.param !== params.param) {
            userList.splice(index, 1);
          }
        })
      }
    })

    console.log(userList)
    return userList
  }

  async function getPosts(params) {

    const postCollection = collection(firestore, 'posts');
    const postSnapshot = await getDocs(postCollection);
    let postList = postSnapshot.docs.map(doc => doc.data())

    if (params) {
      Object.keys(params).forEach((param) => {
        if (Object.keys(postList).includes(param)) {
          postList.forEach((post, index) => {
            if (post.param !== params.param) {
              postList.splice(index, 1);
            }
          })
        }
      })
    }

    return postList
  }
  
  return {
    setPost,
    setUser,
    getUsers,
    getPosts,
  }

})()

export default db