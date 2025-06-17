import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5IrGm_mtjoMdYctQi9-IynJPLt94EPoQ",
  authDomain: "nextjsminiapp.firebaseapp.com",
  projectId: "nextjsminiapp",
  storageBucket: "nextjsminiapp.firebasestorage.app",
  messagingSenderId: "525558720425",
  appId: "1:525558720425:web:3fe95f4a4818d26c3f46b8",
  measurementId: "G-D3X7KKFX4F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
