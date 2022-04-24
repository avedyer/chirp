import { collection, arrayUnion, getDocs, getFirestore, increment, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, listAll, uploadBytes, getMetadata } from "firebase/storage";
import { set, update } from "firebase/database";

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

  const storage = getStorage()


  async function setPost(data) {
    const post = {...data};

    const posts = await getPosts();
    const ids = posts.map(post => post.id)

    let newId = Math.floor(Math.random() * (10**12)).toString()

    while(ids.includes(newId)) {
      newId = Math.floor(Math.random * (10**12)).toString()
    }

    post.id = newId.toString();
    
    setDoc(doc(firestore, 'posts', post.id), post)

    if (post.replyTo) {
      addReply(post.replyTo, post)
    }
  }


  function setUser(data) {
    const user = {...data};
    setDoc(doc(firestore, 'users', user.id), user)
  }

  async function getPfpList() {
    const pfpRef = ref(storage, 'pfp');
    return await listAll(pfpRef);
  }

  async function getPfpUrl(id, ext) {
    const pfpRef = ref(storage, `pfp/${id}.${ext ? ext : 'jpg'}`);
    try {
      const url = await getDownloadURL(pfpRef);
      return url
    }
    catch (err) {
      throw(err)
    }
  }

  async function setPfp(file, id) {
    const pfpPath = ref(storage, `pfp/${id}.jpg`);
    uploadBytes(pfpPath, file)
  }


  async function getUsers(params) {

    const userCollection = collection(firestore, 'users');
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map(doc => doc.data())

    if (params) {
      let trimUserList = []
      Object.keys(params).forEach((param) => {
        if (Object.keys(userList[0]).includes(param)) {
          userList.forEach((user) => {
            if (user[param] === params[param]) {
              trimUserList.push(user)
            }
          })
        }
      })
      return trimUserList
    }
    return userList

  }


  async function getPosts(params) {

    const postCollection = collection(firestore, 'posts');
    const postSnapshot = await getDocs(postCollection);
    const postList = postSnapshot.docs.map(doc => doc.data())

    let trimPostList = []

    if (params) {
      Object.keys(params).forEach((param) => {
        if (Object.keys(postList[0]).includes(param)) {
          postList.forEach((post) => {
            if (post[param] === params[param]) {
              trimPostList.push(post)
            }
          })
        }
      })
    }

    else {
      return postList
    }
    return trimPostList
  }

  async function setLike(user, post) {

    let likes = user.likes;

    const index = likes.indexOf(post.id);

    let diff = 0

    if (index !== -1) {
      likes.splice(index, 1);
      diff--
    }
    else {
      likes.push(post.id);
      diff++
    }

    const userRef = doc(firestore, 'users', user.id);

    await updateDoc(userRef, {
      likes: likes
    })

    const postRef = doc(firestore, 'posts', post.id)

    await updateDoc(postRef, {
      likes: increment(diff)
    })
    
  }

  async function addReply(thread, reply) {
    const threadRef = doc(firestore, 'posts', thread);

    await updateDoc(threadRef, {
      replies: arrayUnion(reply.id)
    })
  }
  
  return {
    setPost,
    setUser,
    setPfp,
    getPfpList,
    getPfpUrl,
    getUsers,
    getPosts,
    setLike,
    addReply
  }

})()

export default db