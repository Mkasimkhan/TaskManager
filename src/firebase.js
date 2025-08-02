// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvmSkyPSur8Uwh9rVDdZfqZ7f9YVnqRyg",
  authDomain: "taskmanager-c066e.firebaseapp.com",
  projectId: "taskmanager-c066e",
  storageBucket: "taskmanager-c066e.firebasestorage.app",
  messagingSenderId: "8261983431",
  appId: "1:8261983431:web:e6acecd637b5b5f46572e2",
  measurementId: "G-WYX3B01T2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app); 
