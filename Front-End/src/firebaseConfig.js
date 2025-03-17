import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZ5IKbv6j_YBoI69E1TuWboLngkiyaJF8",
  authDomain: "gainslog-e14dd.firebaseapp.com",
  projectId: "gainslog-e14dd",
  storageBucket: "gainslog-e14dd.firebasestorage.app",
  messagingSenderId: "734913511314",
  appId: "1:734913511314:web:f8a18e5e068b0c4f904b4b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
