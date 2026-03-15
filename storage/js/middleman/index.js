/**
 * THE CRIB - MIDDLEMAN SERVICE
 * Path: /storage/js/middleman/index.js
 */

window.addEventListener('message', (event) => {
    const request = event.data;

    if (request.type === 'REQUEST_GAME') {
        const title = request.title;
        let filePath = '';

        // Translation Map
        const gameMap = {
            'ragdoll_hit': '/storage/ragdollhit-main/',
            'cookie_clicker': '/storage/cookieclick-main/',
            'geometry_dash': '/storage/gdl-main/',
            'kick_the_sod': '/storage/kickthesod-main',
            'proxycrib': '/storage/proxycrib-main/',
            'polytrack': '/storage/polytrack-0.5.2-clean-main/',
            'minecraft': '/storage/minecraft-main/'
        };

        filePath = gameMap[title];

        if (filePath) {
            window.parent.postMessage({
                type: 'GAME_FOUND',
                title: title,
                filePath: filePath
            }, '*');
        } else {
            window.parent.postMessage({
                type: 'GAME_ERROR',
                message: 'Unknown Title'
            }, '*');
        }
    }
});
