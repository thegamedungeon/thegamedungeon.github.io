function loadWallpaper() {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get('userBg');

    request.onsuccess = () => {
        if (request.result) {
            // Found a custom flex in IndexedDB
            document.body.style.backgroundImage = `url(${request.result})`;
        } else {
            // Nothing found, fall back to default
            document.body.style.backgroundImage = `url('/storage/photos/dbg.png')`;
        }
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
    };

    request.onerror = () => {
        // Just in case of a glitch, stick to the default
        document.body.style.backgroundImage = `url('/storage/photos/dbg.png')`;
        document.body.style.backgroundSize = 'cover';
    };
}
