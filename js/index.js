export function startTypingTest(duration) {
  const typingTextElement = document.querySelector(".typing-text");
  const typingInput = document.querySelector("#typing-input");
  const wpmDisplay = document.querySelector("#wpm");
  const mistakesDisplay = document.querySelector("#mistakes");
  const timerDisplay = document.querySelector("#timer");
  const accuracyDisplay = document.querySelector("#accuracy");
  const timer = document.getElementById("timer");

  const typingTexts = {
    1: "Bursting with imagery, motion, interaction and distraction though it is, today's World Wide Web is still primarily a conduit for textual information.",
    3: "The good news is that, as font embedding becomes more commonplace, font designers are increasingly taking care of rendering and are supplying ever better hinting instructions.",
    5: "As a recent Smashing Magazine article compellingly attests, you put serious pressure on readability by venturing below a 16-pixel font size for paragraph text.",
  };

  let timerInterval;
  let remainingTime = duration * 60;
  let mistakes = 0;
  let charIndex = 0;
  let startTime;
  let isTestActive = false;
  const testText = typingTexts[duration];

  // Format time as mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  // Render text with spans
  function renderTypingText() {
    typingTextElement.innerHTML = testText
      .split("")
      .map((char, i) => `<span class="char${i === 0 ? " current" : ""}">${char}</span>`)
      .join("");
  }

  // Reset the test state
  function resetTest() {
    clearInterval(timerInterval);
    remainingTime = duration * 60;
    mistakes = charIndex = 0;
    typingInput.value = "";
    typingInput.removeEventListener("input", handleTyping);
    renderTypingText();
    timerDisplay.textContent = `Time Left: ${formatTime(remainingTime)}`;
    wpmDisplay.textContent = "0";
    mistakesDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    isTestActive = false;
  }

  // Handle typing input
  function handleTyping() {
    if (!isTestActive) return;
    const typedText = typingInput.value;
    const chars = typingTextElement.querySelectorAll(".char");

    mistakes = 0;
    chars.forEach((span, i) => {
      span.classList.remove("current", "correct", "incorrect");
      if (i < typedText.length) {
        if (typedText[i] === testText[i]) {
          span.classList.add("correct");
        } else {
          span.classList.add("incorrect");
          mistakes++;
        }
      }
      if (i === typedText.length) span.classList.add("current");
    });

    charIndex = Math.min(typedText.length, testText.length);
    updateStats();
  }

  // Update WPM and accuracy
  function updateStats() {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = Math.max(0, (charIndex - mistakes) / 5);
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;

    wpmDisplay.textContent = wpm;
    mistakesDisplay.textContent = mistakes;
    accuracyDisplay.textContent = `${accuracy}%`;
  }

  // Start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      remainingTime--;
      timerDisplay.textContent = `Time Left: ${formatTime(remainingTime)}`;
      if (remainingTime <= 0) {
        endTypingTest();
      }
    }, 1000);
  }

  // End the test and show results
  function endTypingTest() {
    if (!isTestActive) return;
    isTestActive = false;
    clearInterval(timerInterval);
    timer.classList.remove("visible", "pulse");

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const wordsTyped = Math.max(0, (charIndex - mistakes) / 5);
    const wpm = Math.round(wordsTyped / (elapsedSeconds / 60));
    const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;

    saveScore(wpm);
    showResults(elapsedSeconds, wpm, mistakes, accuracy);
  }

  // Save score to leaderboard
  function saveScore(wpm) {
    const username = localStorage.getItem("loggedInUser") || "Guest";
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ username, score: wpm, timestamp: Date.now() });
    leaderboard.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
  }

  // Display results in modal
  function showResults(time, wpm, mistakes, accuracy) {
    const modal = document.getElementById("results-modal");
    const modalResults = document.getElementById("modal-results");
    modalResults.innerHTML = `
      <div class="result-item">Time: ${formatTime(time)}</div>
      <div class="result-item">WPM: ${wpm}</div>
      <div class="result-item">Mistakes: ${mistakes}</div>
      <div class="result-item">Accuracy: ${accuracy}%</div>
    `;
    modal.style.display = "block";
    modal.classList.add("fadeInModal");
  }

  // Initialize test
  resetTest();
  startTime = Date.now();
  isTestActive = true;
  startTimer();
  typingInput.focus();
  typingInput.addEventListener("input", handleTyping);

  // Event listeners
  document.querySelector(".close-btn")?.addEventListener("click", () => {
    document.getElementById("results-modal").style.display = "none";
  });
  document.querySelector("#end-test-btn")?.addEventListener("click", endTypingTest);
}

// DOMContentLoaded event handlers
document.addEventListener("DOMContentLoaded", () => {
  const testButtons = document.querySelectorAll(".test-btn");
  testButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const duration = parseInt(btn.dataset.duration);
      window.location.href = `/pages/test.html?duration=${duration}`;
    });
  });

  const leaderboardBtn = document.querySelector(".check-leaderboard button");
  leaderboardBtn?.addEventListener("click", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    window.location.href = loggedInUser ? "/pages/leaderboard.html" : "/pages/login.html";
  });

  // Set active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPath);
  });
});