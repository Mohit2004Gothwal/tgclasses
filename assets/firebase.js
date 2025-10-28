// assets/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfVKdpyLcUkArxx8jM3zpgnGc0wRV4LS4",
  authDomain: "tg-classes.firebaseapp.com",
  projectId: "tg-classes",
  storageBucket: "tg-classes.firebasestorage.app",
  messagingSenderId: "159009640869",
  appId: "1:159009640869:web:8f41e3f3e2d3aeb5b3584c",
  measurementId: "G-476CR7PJF5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// assets/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfVKdpyLcUkArxx8jM3zpgnGc0wRV4LS4",
  authDomain: "tg-classes.firebaseapp.com",
  projectId: "tg-classes",
  storageBucket: "tg-classes.appspot.com",
  messagingSenderId: "159009640869",
  appId: "1:159009640869:web:8f41e3f3e2d3aeb5b3584c",
  measurementId: "G-476CR7PJF5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
