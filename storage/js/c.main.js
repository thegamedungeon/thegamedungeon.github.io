// Gamepad Navigation Script (Handles Buttons + Navigation Links)
(function () {
  let currentIndex = 0;
  let lastAxisTime = 0;
  let aButtonPressed = false;

  // Includes standard buttons, custom buttons, links with hrefs, and onclick elements
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
      // Must be visible on screen and not disabled
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

      if (elements.length > 0) {
        const dpadUp = gp.buttons[12] && gp.buttons[12].pressed;
        const dpadDown = gp.buttons[13] && gp.buttons[13].pressed;
        const dpadLeft = gp.buttons[14] && gp.buttons[14].pressed;
        const dpadRight = gp.buttons[15] && gp.buttons[15].pressed;

        const stickY = gp.axes[1] || 0;
        const stickX = gp.axes[0] || 0;

        // Directional Navigation
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
            // Trigger standard JS click (handles both buttons and page links)
            currentEl.click();
          }
        } else if (!aButton) {
          aButtonPressed = false;
        }
      }
    }

    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('DOMContentLoaded', () => {
    updateHighlight();
    requestAnimationFrame(pollGamepad);
  });
})();
