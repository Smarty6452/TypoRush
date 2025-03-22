"use strict"; // strict mode

// Export function to start the typing test
export function startTypingTest(duration) {

  //  selectors
  const typingTextElement = $(".typing-text");      
  const typingInput = $("#typing-input");          
  const wpmDisplay = $("#wpm");                    
  const mistakesDisplay = $("#mistakes");     
  const timerDisplay = $("#timer");                 
  const accuracyDisplay = $("#accuracy");           
  const timer = $("#timer");                       

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

  //  Format time as mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  //  Render the typing text with jQuery
  function renderTypingText() {
    typingTextElement.html(
      testText
        .split("")
        .map((char, i) => `<span class="char${i === 0 ? " current" : ""}">${char}</span>`)
        .join("")
    );
  }

  //  Reset the test state with jQuery
  function resetTest() {
    clearInterval(timerInterval);
    remainingTime = duration * 60;
    mistakes = charIndex = 0;
    typingInput.val("");                             // clear input field
    typingInput.off("input", handleTyping);          //remove event listener
    renderTypingText();
    timerDisplay.text(`Time Left: ${formatTime(remainingTime)}`);   // Update using jQuery
    wpmDisplay.text("0");
    mistakesDisplay.text("0");
    accuracyDisplay.text("100%");
    isTestActive = false;
  }

  // Handle typing 
  function handleTyping() {
    if (!isTestActive) return;
    const typedText = typingInput.val();
    const chars = $(".char");                        // Select all characters with 

    mistakes = 0;
    chars.each((i, span) => {                        // Iterate over each character using 
      $(span).removeClass("current correct incorrect");  // Remove all classes

      if (i < typedText.length) {
        if (typedText[i] === testText[i]) {
          $(span).addClass("correct");               //  'correct' class if matched
        } else {
          $(span).addClass("incorrect");             //  'incorrect' class if mismatched
          mistakes++;
        }
      }
      if (i === typedText.length) $(span).addClass("current");   // Highlight current character
    });

    charIndex = Math.min(typedText.length, testText.length);
    updateStats();
  }

  //  Update WPM and accuracy with jQuery
  function updateStats() {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = Math.max(0, (charIndex - mistakes) / 5);
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;

    wpmDisplay.text(wpm);                            
    mistakesDisplay.text(mistakes);                  
    accuracyDisplay.text(`${accuracy}%`);            
  }

  // Start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      remainingTime--;
      timerDisplay.text(`Time Left: ${formatTime(remainingTime)}`);   // timer display
      if (remainingTime <= 0) {
        endTypingTest();
      }
    }, 1000);
  }

  //  End the test and show results
  function endTypingTest() {
    if (!isTestActive) return;
    isTestActive = false;
    clearInterval(timerInterval);
    timer.removeClass("visible pulse");           

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const wordsTyped = Math.max(0, (charIndex - mistakes) / 5);
    const wpm = Math.round(wordsTyped / (elapsedSeconds / 60));
    const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;

    saveScore(wpm);
    showResults(elapsedSeconds, wpm, mistakes, accuracy);
  }

  //  Save score with localStorage
  function saveScore(wpm) {
    const username = localStorage.getItem("loggedInUser") || "Guest";
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ username, score: wpm, timestamp: Date.now() });
    leaderboard.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
  }

  //  Display results in modal with jQuery
  function showResults(time, wpm, mistakes, accuracy) {
    const modal = $("#results-modal");                //  modal
    const modalResults = $("#modal-results");         // modal content

    modalResults.html(`
      <div class="result-item">Time: ${formatTime(time)}</div>
      <div class="result-item">WPM: ${wpm}</div>
      <div class="result-item">Mistakes: ${mistakes}</div>
      <div class="result-item">Accuracy: ${accuracy}%</div>
    `);

    modal.fadeIn(500).addClass("fadeInModal");       // fade-in effect
  }

  //  Initialize test
  resetTest();
  startTime = Date.now();
  isTestActive = true;
  startTimer();
  typingInput.focus();
  typingInput.on("input", handleTyping);             // Use jQuery event handling

  //  Event listeners 
  $(".close-btn").on("click", () => {                //  click event
    $("#results-modal").fadeOut(500);                //  fade-out effect
  });

  $("#end-test-btn").on("click", endTypingTest);     //  event listener
}

//  DOMContentLoaded event handlers using jQuery
$(document).ready(() => {
  const testButtons = $(".test-btn");

  //  Add event listener for each test button 
  testButtons.each(function () {
    $(this).on("click", () => {
      const duration = parseInt($(this).data("duration"));
      window.location.href = `/pages/test.html?duration=${duration}`;
    });
  });

  const leaderboardBtn = $(".check-leaderboard button");

  leaderboardBtn?.on("click", () => {               
    const loggedInUser = localStorage.getItem("loggedInUser");
    window.location.href = loggedInUser ? "/pages/leaderboard.html" : "/pages/login.html";
  });

  //  Set active navigation link using jQuery
  const currentPath = window.location.pathname;
  $(".nav-links a").each(function () {
    $(this).toggleClass("active", $(this).attr("href") === currentPath);
  });
});
