// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDL5BHGDZa6mHJbRuXIWphe7tvfvCaMd_g",
  authDomain: "khushi-photography.firebaseapp.com",
  projectId: "khushi-photography",
  storageBucket: "khushi-photography.firebasestorage.app",
  messagingSenderId: "494824042692",
  appId: "1:494824042692:web:3f83d4efbce605a1cad991",
  measurementId: "G-EB66M0ZV7J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);