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

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Get the game name from the script tag (e.g., <script src="thisfile.js" data-game="geometry-dash"></script>)
const currentScript = document.currentScript;
const game = currentScript.getAttribute('data-game') || "Unknown Game";

// Watch for auth state to get the emailPrefix
onAuthStateChanged(auth, (user) => {
  if (user && user.email) {
    // Extract emailPrefix (everything before the @)
    const emailPrefix = user.email.split('@')[0];
    
    // Path: artifacts/the-game-dungeon-4d75d/public/data/users/(emailPrefix)
    const userDocRef = doc(db, "artifacts", "the-game-dungeon-4d75d", "public", "data", "users", emailPrefix);

    // Set the status and game
    setDoc(userDocRef, {
      status: "online",
      game: game
    }, { merge: true })
    .then(() => {
      console.log(`Status updated for ${emailPrefix}: Playing ${game}`);
    })
    .catch((error) => {
      console.error("Error updating status: ", error);
    });
  } else {
    console.log("No user logged in. Status update skipped.");
  }
});
