// Import the tools from the CDN
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Wait for the window to load so the main Firebase app is ready
window.addEventListener('load', () => {
    try {
        // Grab existing services (no initializeApp call needed)
        const db = getFirestore();
        const auth = getAuth();

        // Get game name from the script tag
        const gameScript = document.querySelector('script[data-game]');
        const game = gameScript ? gameScript.getAttribute('data-game') : "The Crib";

        let currentUserRef = null;

        // Handle Login and "Online" Status
        onAuthStateChanged(auth, (user) => {
            if (user && user.email) {
                const emailPrefix = user.email.split('@')[0];
                currentUserRef = doc(db, "artifacts", "the-game-dungeon-4d75d", "public", "data", "users", emailPrefix);

                setDoc(currentUserRef, {
                    status: "online",
                    game: game
                }, { merge: true }).catch(() => {}); // Keep it silent
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

    } catch (e) {
        console.log("Firebase sync waiting for main app...");
    }
});
