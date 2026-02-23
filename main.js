import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Your Firebase Config (The Crib's Brain)
const firebaseConfig = {
  apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
  authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
  projectId: "the-game-dungeon-4d75d",
  storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
  messagingSenderId: "533459716906",
  appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
  measurementId: "G-CER9SE96MC"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Select UI Elements
const authSection = document.getElementById('auth-section');
const statusText = document.getElementById('debug-status');

// Update Bridge Status immediately so we know the script loaded
if (statusText) {
    statusText.innerText = "The Bridge is Alive, Alex!";
    statusText.style.color = "#0f0"; // Turn it green for the W
}

// 4. Game Keys (The Secret Sauce you found)
const gameKeys = {
  ragdollHit: 'savegame_idbfs_hash',
  cookieClicker: 'CookieClickerGame'
};

// 5. Auth & Sync Logic
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    
    // Update UI to show the user is signed in
    if (authSection) {
        authSection.innerHTML = `
          <a href="account/" class="signin-btn" style="background: #222; color: #0f0; border: 1px solid #0f0;">
            👤 ${user.email}
          </a>`;
    }
    
    // Test the connection immediately
    try {
        await setDoc(doc(db, "saves", user.uid), { 
            lastOnline: new Date(),
            owner: "Alex" 
        }, { merge: true });
        console
