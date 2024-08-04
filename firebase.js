// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf7qNDm87sql6GPkn9KiLx8GH2odQgixw",
  authDomain: "inven-manage.firebaseapp.com",
  projectId: "inven-manage",
  storageBucket: "inven-manage.appspot.com",
  messagingSenderId: "279101399726",
  appId: "1:279101399726:web:f8ea865378cb258204433f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};