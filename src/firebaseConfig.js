// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqqP9pGI1WiJElrF7mTu058k_6vvfPhgs",
    authDomain: "circle-chat-app-5e78a.firebaseapp.com",
    projectId: "circle-chat-app-5e78a",
    storageBucket: "circle-chat-app-5e78a.appspot.com",
    messagingSenderId: "293900606146",
    appId: "1:293900606146:web:881507043ec309e8c6795b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);