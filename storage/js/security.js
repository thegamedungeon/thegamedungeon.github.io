async function startWarden() {
    try {
        // Fetch the custom dcode with a cache-buster so it's always fresh
        const response = await fetch('/storage/dcode/guard.dcode?v=' + Date.now());
        const dcode = await response.text();
        const lines = dcode.split('\n');

        // Internal Variables for the "Translate" and "Receive" processes
        let storage = {};
        
        // The Blacklist - Add the "oink oink" provider names here
        const blacklist = ["Vercel", "Amazon", "Google Cloud", "DigitalOcean", "Microsoft"];

        for (let line of lines) {
            let cmd = line.trim();

            // 1. Process "receive" (Simulating grabbing device info)
            if (cmd.includes('receive "device_time"')) {
                storage['time'] = new Date();
            }

            // 2. Process "translate" (The Timezone Sniffer)
            if (cmd.includes("translate 'time' into timeZone")) {
                // Gets the actual offset in minutes (e.g., -300 for EST)
                storage['DeviceTimeZone'] = new Date().getTimezoneOffset();
            }

            if (cmd.includes('receive "device_time_zone"')) {
                // This is what the browser/network CLAIMS it is
                // Proxies often mess this up or leave it at 0 (UTC)
                storage['InformedZone'] = new Date().getTimezoneOffset(); 
            }

            // 3. The Logic Gates (The "If" and "STOP" commands)
            if (cmd === 'STOP') {
                window.stop(); // Freezes the page loading immediately
            }

            if (cmd.includes('url; open')) {
                // Grabs whatever is inside the quotes
                const path = cmd.match(/"([^"]+)"/)[1];
                window.location.replace(path);
                return; // Exit script once we redirect
            }

            // 4. The Timezone Comparison Trap
            // If the proxy spoofs the location but the system clock is still local... yeet.
            if (cmd.includes("if 'DeviceTimeZone' == 'InformedZone'")) {
                if (storage['DeviceTimeZone'] !== storage['InformedZone']) {
                    // Logic to jump to the 'otherwise' or just trigger the next STOP
                    console.log("Odor detected: Timezone mismatch.");
                }
            }

            // 5. The NetworkInfo Sniffer
            if (cmd.includes("If NetworkInfo ==")) {
                // Check if the user agent or connection hints at a bot-brained proxy
                const isBotBrained = blacklist.some(org => navigator.userAgent.includes(org));
                if (isBotBrained) {
                    console.log("Oink Oink detected.");
                    // The next lines in your dcode handle the STOP/Redirect
                }
            }
        }
    } catch (e) {
        console.error("Warden Error: ", e);
    }
}

// Kick off the process
startWarden();
