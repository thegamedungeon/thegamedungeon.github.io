// Gamepad Navigation Script (with Activation Guard)
(function () {
  let isActivated = false; // Script stays dormant until first controller input
  let currentIndex = 0;
  let lastAxisTime = 0;
  let aButtonPressed = false;

  const INTERACTIVE_SELECTOR = [
    'button',
    'a[href]',
    '[role="button"]',
    '[role="link"]',
    '[onclick]',
    '.button',
    '.btn',
    '.game-card'
  ].join(',');

  function getInteractiveElements() {
    return Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR)).filter(el => {
      const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0;
      const isNotDisabled = !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
      return isVisible && isNotDisabled;
    });
  }

  function updateHighlight() {
    const elements = getInteractiveElements();
    if (elements.length === 0) return;

    if (currentIndex < 0) currentIndex = elements.length - 1;
    if (currentIndex >= elements.length) currentIndex = 0;

    elements.forEach((el, index) => {
      if (index === currentIndex) {
        el.classList.add('controller-highlight');
        el.focus();
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } else {
        el.classList.remove('controller-highlight');
      }
    });
  }

  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

    if (gp) {
      const now = Date.now();
      const elements = getInteractiveElements();

      // Check if ANY button is pressed or stick is moved
      const anyButtonPressed = gp.buttons.some(b => b && b.pressed);
      const stickMoved = gp.axes.some(axis => Math.abs(axis) > 0.5);

      // STEP 1: WAKE UP GUARD
      if (!isActivated) {
        if (anyButtonPressed || stickMoved) {
          isActivated = true; // Wake up!
          updateHighlight(); // NOW we highlight the first element
          // If the activation input was the A button, consume it so it doesn't trigger a click
          if (gp.buttons[0] && gp.buttons[0].pressed) {
            aButtonPressed = true;
          }
        }
        requestAnimationFrame(pollGamepad);
        return; // Don't run navigation logic on the exact frame we wake up
      }

      // STEP 2: NORMAL NAVIGATION LOGIC (Only runs after activation)
      if (elements.length > 0) {
        const dpadUp = gp.buttons[12] && gp.buttons[12].pressed;
        const dpadDown = gp.buttons[13] && gp.buttons[13].pressed;
        const dpadLeft = gp.buttons[14] && gp.buttons[14].pressed;
        const dpadRight = gp.buttons[15] && gp.buttons[15].pressed;

        const stickY = gp.axes[1] || 0;
        const stickX = gp.axes[0] || 0;

        // D-Pad / Stick Movement
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

        // A Button (Button 0)
        const aButton = gp.buttons[0] && gp.buttons[0].pressed;
        if (aButton && !aButtonPressed) {
          aButtonPressed = true;
          const currentEl = elements[currentIndex];
          if (currentEl) {
            currentEl.click();
          }
        } else if (!aButton) {
          aButtonPressed = false; // Reset when released
        }
      }
    }

    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('focus', () => {
    if (isActivated) updateHighlight();
  });

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(pollGamepad);
  });
})();
