// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7UJ2WqW9U7s1uifgCBlm7EqQo0upej0A",
  authDomain: "velox-search-c644a.firebaseapp.com",
  projectId: "velox-search-c644a",
  storageBucket: "velox-search-c644a.firebasestorage.app",
  messagingSenderId: "316965679556",
  appId: "1:316965679556:web:2116c4459a6411d3b63491"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};