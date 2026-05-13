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

// Function to cut the lights when someone leaves
const setOffline = () => {
    const prefix = auth.currentUser?.email.split('@')[0];
    if (prefix) {
        const userDocRef = doc(db, `artifacts/${appId}/public/data/users/${prefix}`);
        // We use updateDoc, but since the page is closing, 
        // we don't 'await' it because we need it to fire and forget.
        updateDoc(userDocRef, {
            currentGame: "Offline"
        });
    }
};

// The modern way to catch an iPad user leaving
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        setOffline();
    }
});

// Keep beforeunload as a backup for desktop druggies
window.addEventListener("beforeunload", setOffline);

    } catch (e) {
        console.log("Firebase sync waiting for main app...");
    }
});
