/**
 * Scramjet Proxy Configuration
 * Points the engine to your specific hydrovolter Wisp server.
 */
self.__scramjet$config = {
    // This MUST match the folder name you created
    prefix: '/play/proxicrib/service/',
    
    // The logic used to scramble the URLs so filters can't read them
    codec: self.__scramjet$codec,
    
    // YOUR SPECIFIC WISP SERVER
    server: 'wss://admin.proxy.hydrovolter.com/scramjet/wisp/',
};

console.log('Scramjet Config Loaded: Tunneling through hydrovolter...');
