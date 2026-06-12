import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyKSy9EVge7Sud1JXA73gyoZL31J7QAB8",
  authDomain: "flashcardsaas-a3b59.firebaseapp.com",
  projectId: "flashcardsaas-a3b59",
  storageBucket: "flashcardsaas-a3b59.appspot.com",
  messagingSenderId: "693615685811",
  appId: "1:693615685811:web:8bd50958951776205500c6",
  measurementId: "G-WNHP377DH2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
