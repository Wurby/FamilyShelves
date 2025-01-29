// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth as initAuth,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { Capacitor } from "@capacitor/core";
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

// Initialize Auth with persistence for Capacitor
const auth = Capacitor.isNativePlatform()
  ? initAuth(app, {
      persistence: indexedDBLocalPersistence,
    })
  : getAuth(app);

const db = getFirestore(app);

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== "undefined") {
  // Check if we're in the browser
  isSupported().then((yes) => (yes ? getAnalytics(app) : null));
}

export async function initializeAuth() {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Auth initialization timeout"));
    }, 10000);

    // For native platforms, resolve immediately
    if (Capacitor.isNativePlatform()) {
      console.log("Firebase: Running on native platform");
      clearTimeout(timeoutId);
      resolve(true);
      return;
    }

    // Otherwise use auth state listener
    auth.onAuthStateChanged(
      () => {
        console.log("Firebase: Auth state change detected");
        clearTimeout(timeoutId);
        resolve(true);
      },
      (error) => {
        console.error("Firebase: Auth state change error", error);
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export { app, analytics, auth, db };
