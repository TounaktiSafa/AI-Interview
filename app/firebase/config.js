import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBic8YsPFUVqO_YxOUM6Y1vwep_Zqfm9jQ",
  authDomain: "pfaapp-92ff0.firebaseapp.com",
  projectId: "pfaapp-92ff0",
  storageBucket: "pfaapp-92ff0.firebasestorage.app",
  messagingSenderId: "501917135670",
  appId: "1:501917135670:web:a7b57d5ad2a8ed6a737997",
  measurementId: "G-Y880X5EGNZ"
};

// Initialize Firebase (client-side only)
let app;
if (typeof window !== "undefined" && !getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

export { app, auth };
