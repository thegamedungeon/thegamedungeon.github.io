// Import the specific Firebase functions we need
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// We don't initialize the app here—we assume it was initialized 
// in the HTML file before this script was imported.

export function initTracker(gameName) {
    const auth = getAuth();
    const db = getFirestore();
    let startTime = Date.now();

    console.log(`[Dungeon Tracker] Started tracking for: ${gameName}`);

    // Listen for visibility changes (pauses if they switch tabs)
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            // If they hide the tab, save the progress so far
            saveToFirebase(auth, db, gameName, startTime);
            console.log("Dungeon time paused. Don't be mid, come back.");
        } else {
            // When they come back, reset the start time to "now"
            startTime = Date.now();
        }
    });

    // Final save when they close the tab or navigate away
    window.addEventListener("beforeunload", () => {
        saveToFirebase(auth, db, gameName, startTime);
    });
}

async function saveToFirebase(auth, db, gameName, startTime) {
    const user = auth.currentUser;
    
    if (user) {
        const endTime = Date.now();
        const secondsPlayed = Math.floor((endTime - startTime) / 1000);

        if (secondsPlayed > 0) {
            const userRef = doc(db, "users", user.uid);

            try {
                await setDoc(userRef, {
                    totalSeconds: increment(secondsPlayed),
                    // Use a dynamic key for each game (e.g., playtime_polytrack)
                    [`playtime_${gameName.replace(/\s+/g, '_').toLowerCase()}`]: increment(secondsPlayed),
                    lastPlayed: new Date().toISOString()
                }, { merge: true });
                
                console.log(`Saved ${secondsPlayed}s to ${gameName}`);
            } catch (error) {
                console.error("Daimyan-proof error: Save failed", error);
            }
        }
    }
}
