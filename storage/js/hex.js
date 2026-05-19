// Check for the saved hex code
let col = localStorage.getItem('urlBarColor');

// If nothing is saved, pick a random color from your choices
if (!col) {
    const fallbacks = ['#00E5FF', '#39FF14', '#8B0000']; // Electric Blue, Neon Green, Dark Red
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    col = fallbacks[randomIndex];
    
    // Save it to local storage for next time
    localStorage.setItem('urlBarColor', col);
}
