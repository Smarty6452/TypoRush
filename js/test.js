"use strict"; // strict mode

import { startTypingTest } from "./index.js";

$(document).ready(() => {
  const $timer = $("#timer");
  const $typingInput = $("#typing-input");

  // get duration from URL
  const urlParams = new URLSearchParams(window.location.search);
  const duration = parseInt(urlParams.get("duration"));

  if (duration) {
    // show timer animation
    if ($timer.length) {
      $timer.addClass("visible pulse"); // add classes for visibility and animation
    }

    // start the test with the specified duration
    startTypingTest(duration);

    // focus input field
    if ($typingInput.length) {
      $typingInput.focus(); //  focus the input field
    }
  } else {
    console.error("No duration specified - Redirecting to home");
    window.location.href = "/pages/index.html"; // redirect if no duration is specified
  }
});
