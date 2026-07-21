// Gamepad Navigation Script
(function () {
  let currentIndex = 0;
  let lastAxisTime = 0; // Debounce timer for D-pad/Joystick
  let aButtonPressed = false; // State track so single press = single click

  // 1. Get all clickable buttons on your page
  function getButtons() {
    return Array.from(document.querySelectorAll('button'));
  }

  // 2. Visual highlight updater
  function updateHighlight() {
    const buttons = getButtons();
    if (buttons.length === 0) return;

    // Keep index inside bounds
    if (currentIndex < 0) currentIndex = buttons.length - 1;
    if (currentIndex >= buttons.length) currentIndex = 0;

    buttons.forEach((btn, index) => {
      if (index === currentIndex) {
        btn.classList.add('controller-highlight');
        btn.focus(); // Focus handles default accessibility highlights
      } else {
        btn.classList.remove('controller-highlight');
      }
    });
  }

  // 3. Polling loop for controller input
  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

    if (gp) {
      const now = Date.now();
      const buttons = getButtons();

      // Standard Mapping Indexes:
      // D-Pad Up: 12 | D-Pad Down: 13 | D-Pad Left: 14 | D-Pad Right: 15
      // Left Stick Vertical: Axis 1 | Left Stick Horizontal: Axis 0
      // A Button: Button 0

      const dpadUp = gp.buttons[12] && gp.buttons[12].pressed;
      const dpadDown = gp.buttons[13] && gp.buttons[13].pressed;
      const dpadLeft = gp.buttons[14] && gp.buttons[14].pressed;
      const dpadRight = gp.buttons[15] && gp.buttons[15].pressed;

      const stickY = gp.axes[1] || 0;
      const stickX = gp.axes[0] || 0;

      // Check Direction (200ms debounce buffer so scrolling stays smooth)
      if (now - lastAxisTime > 200) {
        if (dpadDown || stickY > 0.5 || dpadRight || stickX > 0.5) {
          currentIndex++;
          updateHighlight();
          lastAxisTime = now;
        } else if (dpadUp || stickY < -0.5 || dpadLeft || stickX < -0.5) {
          currentIndex--;
          updateHighlight();
          lastAxisTime = now;
        }
      }

      // Check A Button (Button 0)
      const aButton = gp.buttons[0] && gp.buttons[0].pressed;
      if (aButton && !aButtonPressed) {
        aButtonPressed = true; // Prevents spam clicking while held
        if (buttons[currentIndex]) {
          buttons[currentIndex].click();
        }
      } else if (!aButton) {
        aButtonPressed = false; // Reset state when released
      }
    }

    requestAnimationFrame(pollGamepad);
  }

  // Initialize highlight and kick off loop
  window.addEventListener('DOMContentLoaded', () => {
    updateHighlight();
    requestAnimationFrame(pollGamepad);
  });
})();
