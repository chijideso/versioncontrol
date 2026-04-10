// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlFOAGyMj4nzO3lSgienMau8Q6ufCjdgI",
  authDomain: "versioncontrol-557fb.firebaseapp.com",
  projectId: "versioncontrol-557fb",
  // UPDATED: Corrected storage bucket address
  storageBucket: "versioncontrol-557fb.appspot.com", 
  messagingSenderId: "1031266028325",
  appId: "1:1031266028325:web:38dcc9e9a5ed963013e8cc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);