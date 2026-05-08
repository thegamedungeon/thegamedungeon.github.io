const joy = document.getElementById("joystick");
const stick = document.getElementById("stick");
const jumpBtn = document.getElementById("jumpBtn");

let center = { x: 70, y: 70 };

function sendKey(key, type) {
  document.dispatchEvent(new KeyboardEvent(type, { key }));
}

// JOYSTICK MOVEMENT
joy.addEventListener("touchmove", (e) => {
  let touch = e.touches[0];
  let rect = joy.getBoundingClientRect();
  let x = touch.clientX - rect.left;
  let y = touch.clientY - rect.top;

  let dx = x - center.x;
  let dy = y - center.y;

  let dist = Math.min(Math.hypot(dx, dy), 40);
  let angle = Math.atan2(dy, dx);

  stick.style.left = center.x + Math.cos(angle) * dist - 30 + "px";
  stick.style.top = center.y + Math.sin(angle) * dist - 30 + "px";

  // LEFT
  if (dx < -20) sendKey("ArrowLeft", "keydown");
  else sendKey("ArrowLeft", "keyup");

  // RIGHT
  if (dx > 20) sendKey("ArrowRight", "keydown");
  else sendKey("ArrowRight", "keyup");
});

// RESET WHEN RELEASED
joy.addEventListener("touchend", () => {
  stick.style.left = "40px";
  stick.style.top = "40px";

  sendKey("ArrowLeft", "keyup");
  sendKey("ArrowRight", "keyup");
});

// JUMP BUTTON
jumpBtn.addEventListener("touchstart", () => {
  sendKey("ArrowUp", "keydown");
});

jumpBtn.addEventListener("touchend", () => {
  sendKey("ArrowUp", "keyup");
});
