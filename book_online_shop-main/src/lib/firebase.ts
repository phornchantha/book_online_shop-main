import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9gYwnF0ajFnXAjfJGsxb59dI2vXyVGUQ",
  authDomain: "bookshop-f6f4d.firebaseapp.com",
  projectId: "bookshop-f6f4d",
  storageBucket: "bookshop-f6f4d.firebasestorage.app",
  messagingSenderId: "258156938019",
  appId: "1:258156938019:web:c3cc8efa1c0d2082884296",
  measurementId: "G-MQ6953Q2RH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
