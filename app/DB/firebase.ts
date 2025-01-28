// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYkCuhMrowrsGh43bSfPSaZ_l2mS1xQkU",
  authDomain: "housemaster-40a4b.firebaseapp.com",
  projectId: "housemaster-40a4b",
  storageBucket: "housemaster-40a4b.firebasestorage.app",
  messagingSenderId: "173229501681",
  appId: "1:173229501681:web:a85f51a182ffff1df40d50",
  measurementId: "G-K4N653VDK2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== "undefined") {
  // Check if we're in the browser
  isSupported().then((yes) => (yes ? getAnalytics(app) : null));
}

export { app, analytics, auth, db };
