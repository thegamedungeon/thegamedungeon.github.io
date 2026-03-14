// THE ULTIMATE PERIMETER (vpn.js) - DO NOT LEAK TO CONNOR
(async function wardenElite() {
    // 1. The "Stink Cookie" Check (LocalStorage & SessionStorage)
    if (localStorage.getItem('dungeon_trap') === 'BANNED_BOT' || 
        sessionStorage.getItem('guest_expired') === 'true') {
        window.location.replace("/blicked/gamenope/index.html");
        return;
    }

    try {
        // 2. Network Intelligence API
        // This sniffs out Proxies, VPNs, and Hosting Providers (AWS, Google Cloud, etc.)
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // 3. The Timezone Trap
        // Compares school iPad clock to the IP's location.
        const systemTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const ipTZ = data.timezone;

        // 4. The Organization Blacklist
        // Blocks common VPN/Proxy server companies
        const blacklistedOrgs = ["Amazon", "Google", "DigitalOcean", "M247", "Cloudflare", "Microsoft", "Datacamp"];
        const isSuspiciousOrg = blacklistedOrgs.some(org => data.org.includes(org));

        // 5. THE JUDGEMENT
        if (data.proxy || data.hosting || systemTZ !== ipTZ || isSuspiciousOrg) {
            console.warn("oink oink: Security Breach Detected.");
            
            // Mark his device permanently
            localStorage.setItem('dungeon_trap', 'BANNED_BOT');
            
            // Send him to the void
            window.location.replace("/blicked/gamenope/index.html");
        }

    } catch (e) {
        // If the API call fails, he might be using a high-level blocker.
        // We'll let it slide to avoid false positives, but keep an eye on him.
        console.log("Warden: Connection stealthy.");
    }
})();
