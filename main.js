import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
  authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
  projectId: "the-game-dungeon-4d75d",
  storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
  messagingSenderId: "533459716906",
  appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
  measurementId: "G-CER9SE96MC"
};

// 2. Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const authSection = document.getElementById('auth-section');
const statusText = document.getElementById('debug-status');

// Update Bridge Status immediately
if (statusText) statusText.innerText = "The Bridge is Alive, Alex!";

// 3. Game Keys
const gameKeys = {
  ragdollHit: 'ragdoll_hit_data', // Ensure this matches your game's localStorage key!
  cookieClicker: 'CookieClickerGame'
};

// 4. Auth & Sync Logic
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Update UI
    if (authSection) {
        authSection.innerHTML = `<a href="account/" class="signin-btn" style="background: #555; color: #0f0; border: 1px solid #0f0;">👤 ${user.email}</a>`;
    }
    
    // Connection Test
    await setDoc(doc(db, "saves", user.uid), { status: "Online", owner: "Alex" }, { merge: true });
    
    // Sync Game Data
    syncFromCloud(user.uid);
    startAutoSave(user.uid);
  } else {
    if (authSection) {
        authSection.innerHTML = `<a href="login/" class="signin-btn">🔑 SIGN IN</a>`;
    }
  }
});

async function syncFromCloud(uid) {
    const docSnap = await getDoc(doc(db, "saves", uid));
    if (docSnap.exists()) {
        const data = docSnap.data();
        for (const [game, key] of Object.entries(gameKeys)) {
            if (data[game]) localStorage.setItem(key, data[game]);
        }
    }
}

function startAutoSave(uid) {
    setInterval(async () => {
        const updates = {};
        for (const [game, key] of Object.entries(gameKeys)) {
            const val = localStorage.getItem(key);
            if (val) updates[game] = val;
        }
        if (Object.keys(updates).length > 0) {
            await setDoc(doc(db, "saves", uid), updates, { merge: true });
        }
    }, 30000); // 30 seconds
}
