// presence.js — Operation: Best Friends Forever

// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER",
  appId: "YOUR_APPID",
  measurementId: "YOUR_MEASUREMENT"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// This function is called by the HTML file
// Example: <script>startPresence("Unfair Mario")</script>
function startPresence(currentGame) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      console.log("User not logged in — presence disabled.");
      return;
    }

    // Convert email → username
    const email = user.email;
    const username = email.split("@")[0];

    const userDoc = db
      .collection("artifacts")
      .doc("the-game-dungeon-4d75d")
      .collection("public")
      .doc("data")
      .collection("users")
      .doc(username);

    // Set online + current game
    userDoc.set(
      {
        status: "online",
        current_game: currentGame
      },
      { merge: true }
    );

    console.log(`Presence updated: ${username} is online playing ${currentGame}`);

    // When the tab closes → set offline
    window.addEventListener("beforeunload", () => {
      userDoc.set(
        {
          status: "offline",
          current_game: "none"
        },
        { merge: true }
      );
    });
  });
}
