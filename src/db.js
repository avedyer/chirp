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

  async function setPost(data) {
    const post = {...data};

    const posts = await getPosts();
    const ids = posts.map(post => post.id)

    let newId = Math.floor(Math.random() * (10**12)).toString()

    while(ids.includes(newId)) {
      newId = Math.floor(Math.random * (10**12)).toString()
    }

    post.id = newId;
    
    setDoc(doc(firestore, 'posts', post.id), post)
  }


  function setUser(data) {
    const user = {...data};
    setDoc(doc(firestore, 'users', user.id), user)
  }


  async function getUsers(params) {

    const userCollection = collection(firestore, 'users');
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map(doc => doc.data())

    let trimUserList = []

    if (params) {
      Object.keys(params).forEach((param) => {
        if (Object.keys(userList[0]).includes(param)) {
          userList.forEach((user) => {
            if (user[param] === params[param]) {
              trimUserList.push(user)
            }
          })
        }
      })
    }

    return trimUserList
  }


  async function getPosts(params) {

    const postCollection = collection(firestore, 'posts');
    const postSnapshot = await getDocs(postCollection);
    const postList = postSnapshot.docs.map(doc => doc.data())

    let trimPostList = []

    if (params) {
      Object.keys(params).forEach((param) => {
        if (Object.keys(postList).includes(param)) {
          postList.forEach((post) => {
            if (post[param] === params[param]) {
              trimPostList.push(post)
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