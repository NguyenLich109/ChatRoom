import firebase, { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjEBN3oPMJjsPZyS0bjZLWyx4N6XviEMQ",
  authDomain: "chat-zoom-b0763.firebaseapp.com",
  projectId: "chat-zoom-b0763",
  storageBucket: "chat-zoom-b0763.appspot.com",
  messagingSenderId: "514855677343",
  appId: "1:514855677343:web:2e2bbc56509b8e525ce1aa",
  measurementId: "G-N99LKK5BCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
export { db, auth, storage, analytics };
