// THE DUNGEON TRACKER - DAIMYAN PROOF BUILD
// Import the specific Firebase functions we need (Sync with site v10.7.1)
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Initializes tracking for a specific game.
 * @param {string} gameName - The name exactly as it should appear in the Hall of Records.
 */
export function initTracker(gameName) {
    const auth = getAuth();
    const db = getFirestore();
    let startTime = Date.now();

    console.log(`[Dungeon Tracker] Vault link established for: ${gameName}`);

    // Track state to prevent double-logging
    let isTracking = true;

    // 1. AUTO-SAVE EVERY MINUTE
    // This fixes the "2.6 hour cap" by ensuring data is sent in small chunks constantly.
    setInterval(() => {
        if (isTracking && !document.hidden) {
            saveToFirebase(auth, db, gameName, startTime);
            startTime = Date.now(); // Reset clock for next minute
        }
    }, 60000);

    // 2. VISIBILITY TRACKING
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            saveToFirebase(auth, db, gameName, startTime);
            console.log("Dungeon time paused. Don't be mid, come back.");
        } else {
            startTime = Date.now();
        }
    });

    // 3. FINAL DISPATCH
    window.addEventListener("beforeunload", () => {
        saveToFirebase(auth, db, gameName, startTime);
    });
}

/**
 * Sends the minutes played to the 'playtime' collection.
 */
async function saveToFirebase(auth, db, gameName, startTime) {
    const user = auth.currentUser;
    
    if (user) {
        const endTime = Date.now();
        const msPlayed = endTime - startTime;
        // Convert to minutes for the Hall of Records
        const minutesPlayed = msPlayed / 60000;

        // Only save if at least a tiny bit of time has passed
        if (minutesPlayed > 0.01) {
            // CRITICAL FIX: Match the path used in stats.html
            // Path: playtime/{userId}
            const userRef = doc(db, "playtime", user.uid);

            try {
                await setDoc(userRef, {
                    // Use the raw gameName so it maps perfectly to the UI cards
                    [gameName]: increment(minutesPlayed),
                    lastPlayed: new Date().toISOString(),
                    lastActiveGame: gameName
                }, { merge: true });
                
                console.log(`[Vault] Recorded ${(minutesPlayed * 60).toFixed(0)}s for ${gameName}`);
            } catch (error) {
                console.error("Dungeon Error: The Courier was intercepted.", error);
            }
        }
    } else {
        console.warn("[Vault] No Hero identified. Time is not being recorded.");
    }
}
