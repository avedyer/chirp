import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";

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
const db = getFirestore(app);

export default db