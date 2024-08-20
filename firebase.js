// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyKSy9EVge7Sud1JXA73gyoZL31J7QAB8",
  authDomain: "flashcardsaas-a3b59.firebaseapp.com",
  projectId: "flashcardsaas-a3b59",
  storageBucket: "flashcardsaas-a3b59.appspot.com",
  messagingSenderId: "693615685811",
  appId: "1:693615685811:web:8bd50958951776205500c6",
  measurementId: "G-WNHP377DH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
