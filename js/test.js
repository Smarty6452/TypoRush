import { startTypingTest } from "./index.js";

document.addEventListener("DOMContentLoaded", () => {
  const timer = document.getElementById("timer");
  const typingInput = document.getElementById("typing-input");

  // Get duration from URL
  const urlParams = new URLSearchParams(window.location.search);
  const duration = parseInt(urlParams.get("duration"));

  if (duration) {
    // Show timer animation
    if (timer) {
      timer.classList.add("visible", "pulse");
    }

    // Start the test with the specified duration
    startTypingTest(duration);

    // Focus input field
    if (typingInput) {
      typingInput.focus();
    }
  } else {
    console.error("No duration specified - Redirecting to home");
    window.location.href = "/pages/index.html";
  }
});
