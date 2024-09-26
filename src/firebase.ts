// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Add your Firebase config from the Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCJPLDKvgGF3rDWtRiwBMDZSSJK_twTMns",
    authDomain: "hotel-jn.firebaseapp.com",
    projectId: "hotel-jn",
    storageBucket: "hotel-jn.appspot.com",
    messagingSenderId: "933036054279",
    appId: "1:933036054279:web:81324a3dfa4d33308e17a2"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);