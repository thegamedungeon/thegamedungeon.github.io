/**
 * THE SERVICE WORKER (sw.js)
 * This is the brain of the proxy. It sits between the browser and the web,
 * redirecting all traffic through your Wisp server.
 */

// Import the configuration and codecs we just made
importScripts('scramjet.codecs.js');
importScripts('scramjet.config.js');

// We use a public CDN to pull the core Scramjet worker logic 
// to keep your file count low on the iPad.
importScripts('https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/scramjet@latest/dist/sw.js');

const sw = new ScramjetServiceWorker();

self.addEventListener('fetch', (event) => {
    // If the request is for our proxy prefix, let Scramjet handle it
    if (event.request.url.startsWith(location.origin + self.__scramjet$config.prefix)) {
        event.respondWith(sw.fetch(event));
    }
});

console.log('Tunnel Engine Active: Game #12 is ready for deployment.');
