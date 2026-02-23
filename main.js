<script type="module">
  // 1. Import the Firebase SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

  // 2. Your Firebase Config (The Crib's Credentials)
  const firebaseConfig = {
    apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
    authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
    projectId: "the-game-dungeon-4d75d",
    storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
    messagingSenderId: "533459716906",
    appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
    measurementId: "G-CER9SE96MC"
  };

  // 3. Initialize Firebase Services
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 4. THE SYNC LOGIC (The Brain)
  
  // Track if a user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Yo Alex, " + user.uid + " is logged in!");
      await loadSavesFromCloud(user.uid);
    } else {
      console.log("No user logged in. Progress won't sync to the cloud.");
    }
  });

  // FUNCTION: Upload Local Storage to Firebase
  // Call this function when a user clicks a "Save Progress" button
  async function syncToCloud(gameName, localStorageKey) {
    const user = auth.currentUser;
    if (!user) {
      alert("You gotta sign in to save your progress, bro!");
      return;
    }

    const gameData = localStorage.getItem(localStorageKey);
    if (gameData) {
      try {
        await setDoc(doc(db, "saves", user.uid), {
          [gameName]: gameData,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log(`Saved ${gameName} to the cloud!`);
      } catch (e) {
        console.error("Error saving to cloud: ", e);
      }
    } else {
      console.log("No local data found to save.");
    }
  }

  // FUNCTION: Download Firebase data to Local Storage
  async function loadSavesFromCloud(userId) {
    const docRef = doc(db, "saves", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const allSaves = docSnap.data();
      console.log("Loading saves from cloud...");

      // Example for Cookie Clicker (The key is usually 'CookieClickerSave')
      if (allS
