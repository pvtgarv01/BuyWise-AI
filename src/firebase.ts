import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJjADovP1t8YusOKyG-odGbnZvHwHDPCY",
  authDomain: "buywise-ai-9272d.firebaseapp.com",
  projectId: "buywise-ai-9272d",
  storageBucket: "buywise-ai-9272d.firebasestorage.app",
  messagingSenderId: "1036271507354",
  appId: "1:1036271507354:web:11c6248c4b49fb07b20c23",
  measurementId: "G-D33X2W5K6D"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;