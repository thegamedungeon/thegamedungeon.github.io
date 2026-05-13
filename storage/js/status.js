// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
  authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
  projectId: "the-game-dungeon-4d75d",
  storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
  messagingSenderId: "533459716906",
  appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
  measurementId: "G-CER9SE96MC"
};

// Import Firebase SDKs
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase (Check if already initialized to fix "duplicate-app" error)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Get game name (Improved selector to fix the null 'currentScript' error)
const gameScript = document.querySelector('script[data-game]');
const game = gameScript ? gameScript.getAttribute('data-game') : "Unknown Game";

let currentUserRef = null;

// Handle Login and "Online" Status
onAuthStateChanged(auth, (user) => {
  if (user && user.email) {
    const emailPrefix = user.email.split('@')[0];
    currentUserRef = doc(db, "artifacts", "the-game-dungeon-4d75d", "public", "data", "users", emailPrefix);

    setDoc(currentUserRef, {
      status: "online",
      game: game
    }, { merge: true }).catch(err => console.error("Update error:", err));
  }
});

// Handle "Offline" Status on Tab Close
window.addEventListener('beforeunload', () => {
  if (currentUserRef) {
    updateDoc(currentUserRef, {
      status: "offline",
      game: null
    });
  }
});
