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
