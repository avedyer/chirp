import db from "./db"

import { doc, setDoc } from "firebase/firestore"; 

function generateId(oldIds) {

}

function writePost(data) {
  let post = {...data};
  setDoc(doc(db, 'posts', post.id.toString()), post)
}

export { generateId, writePost }