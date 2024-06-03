import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRUgOJnmss3Krtxsdgo8ETLQSLAye7Rhk",
  authDomain: "user-beyond-login.firebaseapp.com",
  projectId: "user-beyond-login",
  storageBucket: "user-beyond-login.appspot.com",
  messagingSenderId: "291811375175",
  appId: "1:291811375175:web:22319e4ef6a32a3f539962",
  measurementId: "G-FDJMT99J65",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
