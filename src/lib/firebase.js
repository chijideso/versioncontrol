// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlFOAGyMj4nzO3lSgienMau8Q6ufCjdgI",
  authDomain: "versioncontrol-557fb.firebaseapp.com",
  projectId: "versioncontrol-557fb",
  storageBucket: "versioncontrol-557fb.firebasestorage.app",
  messagingSenderId: "1031266028325",
  appId: "1:1031266028325:web:38dcc9e9a5ed963013e8cc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

