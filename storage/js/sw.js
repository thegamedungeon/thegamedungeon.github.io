// Listen for incoming scrolls (messages)
self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const title = data.sender || "New Scroll";
    const options = {
        body: data.body || "You got a new message in The Crib.",
        icon: '/storage/photos/tgdtc.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Logic for the 3-day inactivity check
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'inactivity-check') {
        event.waitUntil(checkInactivity());
    }
});

async function checkInactivity() {
    // You'd pull the last played timestamp from your IndexedDB
    const lastPlayed = await getLastPlayedDate(); 
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (Date.now() - lastPlayed >= threeDays) {
        const messages = [
            "Bro where tf are you? Hop on!",
            "The Game Dungeon is rusting. Hop on now.",
            "Dude, your playtime is suffering. Come play!"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        self.registration.showNotification("The Crib", {
            body: randomMsg,
            icon: '/storage/photos/tgdtc.png'
        });
    }
}
