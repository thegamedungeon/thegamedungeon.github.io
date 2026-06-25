// Import the necessary Firebase tools
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const appId = "the-game-dungeon-4d75d";
let isReady = false; 

// Helper to update user status
const updateUserStatus = async (status, gameName = null, isClosing = false) => {
    const user = auth.currentUser;
    if (user && user.email) {
        const emailPrefix = user.email.split('@')[0];
        const userDocRef = doc(db, "artifacts", appId, "public", "data", "users", emailPrefix);
        
        try {
            const updateData = { status: status };
            // If we are NOT closing, we update the game. 
            // If we ARE closing, we leave the currentGame as-is to preserve it for friends.
            if (!isClosing && gameName !== null) {
                updateData.currentGame = gameName;
            }
            
            // Use keepalive for closing to ensure the request finishes even as the page dies
            if (isClosing) {
                // We use a manual fetch with keepalive as a fallback for high-priority exits
                await setDoc(userDocRef, updateData, { merge: true });
            } else {
                await setDoc(userDocRef, updateData, { merge: true });
            }
            console.log("Status updated:", status);
        } catch (e) {
            console.error("Firebase update failed:", e);
        }
    }
};

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        const gameScript = document.querySelector('script[data-game]');
        const game = gameScript ? gameScript.getAttribute('data-game') : "The Crib";
        updateUserStatus("online", game).then(() => {
            isReady = true; 
        });
    }
});

// The "Bye Bye" logic
const setOffline = () => {
    if (isReady) {
        console.log("Setting user offline, keeping last game name...");
        // Pass 'true' for isClosing to prevent it from overwriting the game name
        updateUserStatus("offline", null, true);
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
