// Import the necessary Firebase tools
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const appId = "the-game-dungeon-4d75d";

// Helper to update user status
// Now optionally updates the game name if provided
const updateUserStatus = async (status, gameName = null) => {
    const user = auth.currentUser;
    if (user && user.email) {
        const emailPrefix = user.email.split('@')[0];
        const userDocRef = doc(db, "artifacts", appId, "public", "data", "users", emailPrefix);
        
        try {
            const updateData = { status: status };
            // Only update the game name if one is provided
            if (gameName !== null) {
                updateData.currentGame = gameName;
            }
            
            await setDoc(userDocRef, updateData, { merge: true });
        } catch (e) {
            // Keeping it silent
        }
    }
};

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        const gameScript = document.querySelector('script[data-game]');
        const game = gameScript ? gameScript.getAttribute('data-game') : "The Crib";
        updateUserStatus("online", game);
    }
});

// The "Bye Bye" logic
// Now just sets status to offline, keeping the last game in the document
const setOffline = () => {
    updateUserStatus("offline");
};

// Catching the leave event properly
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        setOffline();
    }
});

// Fallback for Desktop
window.addEventListener("beforeunload", setOffline);
