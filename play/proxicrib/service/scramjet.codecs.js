/**
 * Scramjet URL Codec
 * This scrambles the URL in the address bar so the "oink oink" security
 * doesn't see "now.gg" in the network logs.
 */
const xor = {
    key: 2,
    encode(str) {
        if (!str) return str;
        return btoa(
            encodeURIComponent(
                str.split('').map((char, ind) => ind % xor.key ? String.fromCharCode(char.charCodeAt(0) ^ xor.key) : char).join('')
            )
        );
    },
    decode(str) {
        if (!str) return str;
        let [url, ...search] = str.split('?');
        return (
            decodeURIComponent(
                atob(url).split('').map((char, ind) => ind % xor.key ? String.fromCharCode(char.charCodeAt(0) ^ xor.key) : char).join('')
            ) + (search.length ? '?' + search.join('?') : '')
        );
    },
};

// We assign it to the global self for the worker to find
self.__scramjet$codec = xor;
