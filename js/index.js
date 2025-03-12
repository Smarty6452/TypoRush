export function startTypingTest(duration) {
  const typingTextElement = document.querySelector(".typing-text");
  const typingInput = document.querySelector("#typing-input");
  const wpmDisplay = document.querySelector("#wpm");
  const mistakesDisplay = document.querySelector("#mistakes");
  const timerDisplay = document.querySelector("#timer");
  const accuracyDisplay = document.querySelector("#accuracy");
  const timer = document.getElementById("timer");

  // Define different typing texts for each duration
  //Pickering, H., About The AuthorHeydon Pickering (@heydonworks) has worked with The Paciello Group, & Author, A. T. (2011, November 29). The perfect paragraph. Smashing Magazine. https://www.smashingmagazine.com/2011/11/the-perfect-paragraph/
  const typingTexts = {
    1: "Bursting with imagery, motion, interaction and distraction though it is, today's World Wide Web is still primarily a conduit for textual information. In HTML5, the focus on writing and authorship is more pronounced than ever.",
    3: "The good news is that, as font embedding becomes more commonplace, font designers are increasingly taking care of rendering and are supplying ever better hinting instructions. Typekit itself has even intervened by manually re-hinting popular fonts such as Museo. Your best bet is to view on-page demonstrations of the fonts you are considering, to see how well they turn out. Save time by avoiding, sight unseen, any fonts with the words “thin” or “narrow” in their names.",
    5: "As a recent Smashing Magazine article compellingly attests, you put serious pressure on readability by venturing below a 16-pixel font size for paragraph text. All popular browsers render text at 16 pixels by default. This is a good enough indication (given the notorious tendency among browser makers to disagree) that 16 pixels is a clear standard. What’s more, the standard is given credence by an equivalent convention in print typography, as the article points out.",
  };

  let timerInterval;
  let remainingTime = duration * 60;
  let mistakes = 0;
  let charIndex = 0;
  let startTime;
  let isTestActive = false;

  // Format time to minutes and seconds
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  // Render typing text progressively
  function renderTypingText(text) {
    typingTextElement.innerHTML = ""; // Clear previous text
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("char");
      if (index === 0) {
        span.classList.add("current"); // Highlight first character
      }
      typingTextElement.appendChild(span);
    });
  }

  // Reset test
  function resetTest() {
    charIndex = mistakes = 0;
    typingInput.value = "";
    typingInput.removeEventListener("input", handleTypingInput);
    renderTypingText(""); // Clear text
    timerDisplay.textContent = "Time Left: 0s";
    wpmDisplay.textContent = "0";
    mistakesDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    isTestActive = false;
  }

  function handleTypingInput() {
    if (!isTestActive) return;

    const typedText = typingInput.value;
    const spanElements = typingTextElement.querySelectorAll(".char");

    // Reset all 'current' classes and update correct/incorrect
    spanElements.forEach((span, index) => {
      span.classList.remove("current");
      if (index < typedText.length) {
        if (typedText[index] === span.textContent) {
          span.classList.add("correct");
          span.classList.remove("incorrect");
        } else {
          span.classList.add("incorrect");
          span.classList.remove("correct");
          mistakes++;
        }
      } else {
        span.classList.remove("correct", "incorrect");
      }
    });

    // Highlight the next character to type
    if (charIndex < spanElements.length) {
      spanElements[charIndex].classList.add("current");
    }

    // Update charIndex
    charIndex = typedText.length;

    updateWPM();
    updateAccuracy();
  }

  // Start timer
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        timerDisplay.textContent = `Time Left: ${remainingTime}s`;
      } else {
        endTypingTest();
        timer.classList.remove("visible", "pulse");
      }
    }, 1000);
  }

  // Calculate and update WPM
  function updateWPM() {
    const wordsTyped = Math.floor((charIndex - mistakes) / 5); // Words typed without mistakes
    const elapsedTimeInMinutes = (Date.now() - startTime) / 60000; // Time in minutes
    const wpm = Math.round(wordsTyped / elapsedTimeInMinutes); // WPM calculation
    wpmDisplay.textContent = wpm > 0 ? wpm : 0; // Display WPM
    mistakesDisplay.textContent = mistakes; // Display Mistakes
  }

  // Update accuracy
  function updateAccuracy() {
    const accuracy =
      charIndex > 0
        ? Math.round(((charIndex - mistakes) / charIndex) * 100)
        : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
  }

  // Save high score
  function saveHighScore(wpm) {
    let highScore = localStorage.getItem("highScore") || 0;
    if (wpm > highScore) {
      localStorage.setItem("highScore", wpm);
      const highScoreDisplay = document.querySelector("#high-score");
      if (highScoreDisplay) {
        highScoreDisplay.textContent = `${wpm} WPM`;
      }
    }
  }

  // Load high score
  function loadHighScore() {
    const highScore = localStorage.getItem("highScore") || 0;
    const highScoreDisplay = document.querySelector("#high-score");
    if (highScoreDisplay) {
      highScoreDisplay.textContent = `${highScore} WPM`;
    }
  }

  // End typing test
  function endTypingTest() {
    if (!isTestActive) return;
    isTestActive = false;
    clearInterval(timerInterval);
    timer.classList.remove("visible", "pulse");

    // Calculate the time taken and other statistics
    const elapsedTimeInSeconds = Math.max(
      1,
      Math.round((Date.now() - startTime) / 1000)
    );
    const timeTaken = formatTime(elapsedTimeInSeconds);
    const wordsTyped = Math.floor((charIndex - mistakes) / 5);
    const elapsedTimeInMinutes = elapsedTimeInSeconds / 60;
    const wpm = Math.round(wordsTyped / elapsedTimeInMinutes);
    const accuracy =
      charIndex > 0
        ? Math.round(((charIndex - mistakes) / charIndex) * 100)
        : 0;

    saveHighScore(wpm);

    // Display results in the modal
    const resultsModal = document.getElementById("results-modal");
    const modalResults = document.getElementById("modal-results");

    if (modalResults && resultsModal) {
      modalResults.innerHTML = `
        <div class="result-item">
            <span class="result-label">Time Taken:</span>
            <span class="result-value">${timeTaken}</span>
        </div>
        <div class="result-item">
            <span class="result-label">WPM:</span>
            <span class="result-value">${wpm}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Mistakes:</span>
            <span class="result-value">${mistakes}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Accuracy:</span>
            <span class="result-value">${accuracy}%</span>
        </div>
      `;

      // Show the modal
      resultsModal.style.display = "block";
    }
  }

  // Initialize the typing test
  resetTest();
  const typingText = typingTexts[duration]; // Use the text based on selected duration
  renderTypingText(typingText);
  startTime = Date.now(); // Track the start time to calculate WPM
  isTestActive = true;
  startTimer();
  typingInput.focus();
  typingInput.addEventListener("input", handleTypingInput);

  // Setup close modal button
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    const resultsModal = document.getElementById("results-modal");
    closeBtn.addEventListener("click", () => {
      if (resultsModal) {
        resultsModal.style.display = "none";
      }
    });
  }

  // Setup end test button
  const endTestBtn = document.querySelector("#end-test-btn");
  if (endTestBtn) {
    endTestBtn.addEventListener("click", endTypingTest);
  }

  // Load high score
  loadHighScore();
}

// Setup event handlers once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set event listeners for test duration buttons on the home page
  const testButtons = document.querySelectorAll(".test-btn");
  if (testButtons.length > 0) {
    testButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const duration = parseInt(button.dataset.duration);
        window.location.href = `/pages/test.html?duration=${duration}`;
      });
    });
  }

  // Setup leaderboard button
  const leaderboardButton = document.querySelector(".check-leaderboard button");
  if (leaderboardButton) {
    leaderboardButton.addEventListener("click", () => {
      window.location.href = "/pages/leaderboard.html";
    });
  }
});
