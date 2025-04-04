import { initializeApp,getApps,getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUC9eq2OrTjZdjEumZcsC7pikYZrZP2xQ",
  authDomain: "interviewx-f6672.firebaseapp.com",
  projectId: "interviewx-f6672",
  storageBucket: "interviewx-f6672.firebasestorage.app",
  messagingSenderId: "687822821193",
  appId: "1:687822821193:web:1637ff059a23be5d8e2c98",
  measurementId: "G-SZ681HB2KL"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)
