alert("Main.js has started!");
// 1. IMMEDIATE BRIDGE CHECK (Before anything else runs)
const statusText = document.getElementById('debug-status');
if (statusText) statusText.innerText = "Bridge Loading...";

// 2. CORRECT IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 3. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
  authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
  projectId: "the-game-dungeon-4d75d",
  storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
  messagingSenderId: "533459716906",
  appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
  measurementId: "G-CER9SE96MC"
};

// 4. INITIALIZE & PERSISTENCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Force iPad to remember the login
setPersistence(auth, browserLocalPersistence);

const authSection = document.getElementById('auth-section');

// 5. THE MAGIC BRIDGE
if (statusText) {
    statusText.innerText = "El Bridgo es Alive!";
    statusText.style.color = "#0f0";
}

// 6. GAME KEYS
const gameKeys = {
  ragdollHit: 'savegame_idbfs_hash',
  cookieClicker: 'CookieClickerGame'
};

// 7. AUTH & SYNC LOGIC
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Logged in as:", user.email);
    
    if (authSection) {
        authSection.innerHTML = `
          <a href="account/" class="signin-btn" style="background: #222; color: #0f0; border: 1px solid #0f0;">
            👤 ${user.email}
          </a>`;
    }
    
    // Test Handshake
    try {
        await setDoc(doc(db, "saves", user.uid), { 
            lastOnline: new Date(),
            owner: "Alex" 
        }, { merge: true });
    } catch (e) {
        console.error("Firebase error:", e);
    }

    syncFromCloud(user.uid);
    startAutoSave(user.uid);

  } else {
    if (authSection) {
        authSection.innerHTML = `<a href="login/" class="signin-btn">🔑 SIGN IN</a>`;
    }
  }
});

async function syncFromCloud(uid) {
    try {
        const docSnap = await getDoc(doc(db, "saves", uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            for (const [gameName, storageKey] of Object.entries(gameKeys)) {
                if (data[gameName]) {
                    localStorage.setItem(storageKey, data[gameName]);
                }
            }
        }
    } catch (e) { console.error(e); }
}

function startAutoSave(uid) {
    setInterval(async () => {
        const updates = {};
        let hasNewData = false;
        for (const [gameName, storageKey] of Object.entries(gameKeys)) {
            const currentData = localStorage.getItem(storageKey);
            if (currentData) {
                updates[gameName] = currentData;
                hasNewData = true;
            }
        }
        if (hasNewData) {
            await setDoc(doc(db, "saves",
