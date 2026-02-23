import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 1. Your Firebase Configuration
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

// 3. The Magic Keys (MUST match what the games use in LocalStorage)
const gameKeys = {
  cookieClicker: 'CookieClickerSave',
  geometryDash: 'GDSaveData',
  polytrack: 'polytrack_save',
  basketRandom: 'basket_random_stats',
  ragdollHit: 'ragdoll_hit_data', // Double check this key in the game files!
  minecraft: 'minecraft_world',
  kickTheSod: 'kts_save',
  proxycrib: 'proxy_settings'
};

// 4. The Auth Watcher
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Yo Alex, logged in as:", user.uid);

    // --- CONNECTION TEST: Look for this in Firestore! ---
    try {
      await setDoc(doc(db, "saves", user.uid), { 
        connection_status: "Online",
        last_login: new Date().toISOString(),
        owner: "Alex"
      }, { merge: true });
    } catch (e) {
      console.error("Firebase connection failed:", e);
    }

    // Load saves from Cloud to iPad
    await syncFromCloud(user.uid);
    
    // Start auto-saving from iPad to Cloud every 60s
    startAutoSave(user.uid);
  } else {
    console.log("No user logged in. Stay chill.");
  }
});

// 5. Function: Pull data from Firebase and inject into Browser
async function syncFromCloud(userId) {
  try {
    const docRef = doc(db, "saves", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      console.log("Cloud data found! Injecting saves...");
      
      for (const [game, storageKey] of Object.entries(gameKeys)) {
        if (cloudData[game]) {
          localStorage.setItem(storageKey, cloudData[game]);
        }
      }
    }
  } catch (err) {
    console.error("Failed to sync from cloud:", err);
  }
}

// 6. Function: Push Browser data to Firebase
function startAutoSave(userId) {
  setInterval(async () => {
    const updates = {};
    let dataToSync = false;

    for (const [game, storageKey] of Object.entries(gameKeys)) {
      const localValue = localStorage.getItem(storageKey);
      if (localValue) {
        updates[game] = localValue;
        dataToSync = true;
      }
    }

    if (dataToSync) {
      try {
        await setDoc(doc(db, "saves", userId), updates, { merge: true });
        console.log("Dungeon cloud sync complete.");
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }
  }, 600
