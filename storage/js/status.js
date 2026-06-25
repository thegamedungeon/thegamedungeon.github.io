// Import the necessary Firebase tools
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const appId = "the-game-dungeon-4d75d";

let isReady = false; // Prevents "offline" from firing during initial load

// Helper to update user status
const updateUserStatus = async (status, gameName = null) => {
    const user = auth.currentUser;
    if (user && user.email) {
        const emailPrefix = user.email.split('@')[0];
        const userDocRef = doc(db, "artifacts", appId, "public", "data", "users", emailPrefix);
        
        try {
            const updateData = { status: status };
            if (gameName !== null) {
                updateData.currentGame = gameName;
            }
            
            await setDoc(userDocRef, updateData, { merge: true });
            console.log("Status updated successfully:", status, gameName || "");
        } catch (e) {
            console.error("Firebase update failed (Dungeon Error):", e);
        }
    }
};

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User detected, syncing status...");
        const gameScript = document.querySelector('script[data-game]');
        const game = gameScript ? gameScript.getAttribute('data-game') : "The Crib";
        
        updateUserStatus("online", game).then(() => {
            isReady = true; // Only allow offline status after initial sync
        });
    }
});

// The "Bye Bye" logic
const setOffline = () => {
    if (isReady) {
        console.log("Setting user offline...");
        updateUserStatus("offline");
    }
};

// Catching the leave event properly
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        setOffline();
    }
});

// Fallback for Desktop
window.addEventListener("beforeunload", setOffline);
