import emailjs from '@emailjs/browser';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Note: Replace these with your actual Firebase config initialization
const db = getFirestore();

async function checkAndSendPlaytimeAlerts() {
    const accountsRef = collection(db, "accounts");
    const snapshot = await getDocs(accountsRef);
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    for (const user of allUsers) {
        if (!user.friends || user.friends.length === 0) continue;

        // Get playtime for the user and their friends
        let friendData = [];
        for (const friendUid of user.friends) {
            const friendDoc = await getDoc(doc(db, "accounts", friendUid));
            if (friendDoc.exists()) {
                friendData.push({ 
                    email: friendDoc.data().email, 
                    playtime: friendDoc.data().playtime || 0 
                });
            }
        }

        // Sort friends by playtime descending
        friendData.sort((a, b) => b.playtime - a.playtime);

        // Check if user is #1
        const isHighest = friendData.every(f => user.playtime > f.playtime);

        if (isHighest && friendData.length > 0) {
            const secondPlace = friendData[0]; // After sorting, the one with most time is at [0]

            const templateParams = {
                to_name: user.username,
                from_name: "The Crib",
                message1: "You’ve got the highest time on The Game Dungeon! However,",
                2: secondPlace.email,
                message2: "is behind you. Be careful!",
                to_email: user.email
            };

            // Send via EmailJS
            emailjs.send('service_n2hsxcf', 'template_58qiu5r', templateParams)
                .then(() => console.log(`Alert sent to ${user.username}`))
                .catch(err => console.error("Email failed:", err));
        }
    }
}
