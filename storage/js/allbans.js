// TASK: THE WARDEN (allbans.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAn1vmoPRGXgtsGQrKGtpf0Jt89HWoXRUI",
    authDomain: "the-game-dungeon-4d75d.firebaseapp.com",
    projectId: "the-game-dungeon-4d75d",
    storageBucket: "the-game-dungeon-4d75d.firebasestorage.app",
    messagingSenderId: "533459716906",
    appId: "1:533459716906:web:377bf4ea74cf21bf8aac53",
    measurementId: "G-CER9SE96MC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const jailRef = doc(db, "dungeon_jail", user.email.toLowerCase());
        const jailSnap = await getDoc(jailRef);

        if (jailSnap.exists()) {
            const data = jailSnap.data();
            const now = new Date();
            const releaseDate = data.releaseDate.toDate();

            if (now < releaseDate) {
                // STILL BLICKED
                console.log("Warden: Sentence Active.");
                window.location.href = "/blicked.html";
            } else {
                // AUTO-PAROLE
                await deleteDoc(jailRef);
                console.log("Warden: Sentence served. Entry deleted.");
            }
        }
    }
});
