(function() {
    // Check if the URL has that specific flag
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('fs') === 'true') {
        const forceFullscreen = () => {
            // Check if we are NOT currently in fullscreen
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    // This usually fails if there hasn't been a tap yet
                    console.log("Waiting for a user tap to trigger fullscreen...");
                });
            }
        };

        // Listen for any tap on the screen to trigger/restore fullscreen
        window.addEventListener('click', forceFullscreen);
        window.addEventListener('touchstart', forceFullscreen);

        // Check every second to make sure it hasn't been closed
        setInterval(forceFullscreen, 1000);
    }
})();
