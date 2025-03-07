document.addEventListener('DOMContentLoaded', () => {
    const typingTextElement = document.querySelector('.typing-text');
    const typingInput = document.querySelector('#typing-input');
    const wpmDisplay = document.querySelector('#wpm');
    const mistakesDisplay = document.querySelector('#mistakes');
    const timerDisplay = document.querySelector('#timer');
    const endTestBtn = document.querySelector('#end-test-btn');
    const testButtons = document.querySelectorAll('.test-btn');
    const accuracyDisplay = document.querySelector('#accuracy');
    const highScoreDisplay = document.querySelector('#high-score');
    const resultsModal = document.getElementById('results-modal');
    const modalResults = document.getElementById('modal-results');


    // Define different typing texts for each duration
    //Pickering, H., About The AuthorHeydon Pickering (@heydonworks) has worked with The Paciello Group, & Author, A. T. (2011, November 29). The perfect paragraph. Smashing Magazine. https://www.smashingmagazine.com/2011/11/the-perfect-paragraph/ 
    const typingTexts = {
        1: "Bursting with imagery, motion, interaction and distraction though it is, today's World Wide Web is still primarily a conduit for textual information. In HTML5, the focus on writing and authorship is more pronounced than ever.",
        3: "The good news is that, as font embedding becomes more commonplace, font designers are increasingly taking care of rendering and are supplying ever better hinting instructions. Typekit itself has even intervened by manually re-hinting popular fonts such as Museo. Your best bet is to view on-page demonstrations of the fonts you are considering, to see how well they turn out. Save time by avoiding, sight unseen, any fonts with the words “thin” or “narrow” in their names.",
        5: "As a recent Smashing Magazine article compellingly attests, you put serious pressure on readability by venturing below a 16-pixel font size for paragraph text. All popular browsers render text at 16 pixels by default. This is a good enough indication (given the notorious tendency among browser makers to disagree) that 16 pixels is a clear standard. What’s more, the standard is given credence by an equivalent convention in print typography, as the article points out."
    };

    let timerInterval;
    let remainingTime = 60;
    let mistakes = 0;
    let charIndex = 0;
    let startTime;
    let isTestActive = false;

    timer.classList.remove('visible');

    // Format time to minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // Render typing text progressively
    function renderTypingText(text) {
        typingTextElement.innerHTML = ""; // Clear previous text
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            typingTextElement.appendChild(span);
        }
    }

    // Initialize the typing test
    function startTypingTest(duration) {
        resetTest();
        remainingTime = duration * 60;
        const typingText = typingTexts[duration]; // Use the text based on selected duration
        renderTypingText(typingText);
        startTime = Date.now();  // Track the start time to calculate WPM
        isTestActive = true;
        startTimer();
        typingInput.focus();
        typingInput.addEventListener('input', handleTypingInput);
        document.querySelector('.typing-test').scrollIntoView({ behavior: 'smooth' });

    }

    // Handle typing input
    function handleTypingInput() {
        if (!isTestActive) return;

        const typedChar = typingInput.value[charIndex];
        const spanElements = typingTextElement.querySelectorAll('span');
        const currentCharSpan = spanElements[charIndex];

        if (typedChar === currentCharSpan.textContent) {
            currentCharSpan.classList.add('correct');
        } else if (typedChar !== undefined) {
            currentCharSpan.classList.add('incorrect');
            mistakes++;
        }

        // Show next character once current is typed correctly
        if (typedChar !== undefined) {
            charIndex++;
            // Reveal next character in the text if it's typed correctly
            if (charIndex < spanElements.length) {
                spanElements[charIndex].classList.add('active'); // Optional class to highlight the next character
            }
        }
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
                timer.classList.remove('visible', 'pulse');

            }
        }, 1000);
    }

    // Calculate and update WPM
    function updateWPM() {
        const wordsTyped = Math.floor((charIndex - mistakes) / 5); // Words typed without mistakes
        const elapsedTimeInMinutes = (Date.now() - startTime) / 60000;  // Time in minutes
        const wpm = Math.round(wordsTyped / elapsedTimeInMinutes);  // WPM calculation
        wpmDisplay.textContent = wpm > 0 ? wpm : 0;  // Display WPM
        mistakesDisplay.textContent = mistakes;  // Display Mistakes
    }

    // Update accuracy
    function updateAccuracy() {
        const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;
        accuracyDisplay.textContent = ` ${accuracy}%`;
    }

    // Save high score
    function saveHighScore(wpm) {
        let highScore = localStorage.getItem('highScore') || 0;
        if (wpm > highScore) {
            localStorage.setItem('highScore', wpm);
            highScoreDisplay.textContent = ` ${wpm} WPM`;
        }
    }

    // Load high score
    function loadHighScore() {
        const highScore = localStorage.getItem('highScore') || 0;
        highScoreDisplay.textContent = ` ${highScore} WPM`;
    }

    // End typing test
    function endTypingTest() {
        if (!isTestActive) return;
        isTestActive = false;
        clearInterval(timerInterval);
        timer.classList.remove('visible', 'pulse');

        // Calculate the time taken and other statistics
        const elapsedTimeInSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        const timeTaken = formatTime(elapsedTimeInSeconds);
        const wordsTyped = Math.floor((charIndex - mistakes) / 5);
        const elapsedTimeInMinutes = elapsedTimeInSeconds / 60;
        const wpm = Math.round(wordsTyped / elapsedTimeInMinutes);
        const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;
        
        saveHighScore(wpm);
        
        // Display results in the modal
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
        resultsModal.style.display = 'block'; 
    }

    // Reset test
    function resetTest() {
        charIndex = mistakes = 0;
        typingInput.value = '';
        typingInput.removeEventListener('input', handleTypingInput);
        renderTypingText(""); // Clear text
        timerDisplay.textContent = 'Time Left: 0s';
        wpmDisplay.textContent = '0';
        mistakesDisplay.textContent = '0';
        accuracyDisplay.textContent = 'Accuracy: 100%';
        isTestActive = false;
    }
    endTestBtn.addEventListener('click', () => {
        // Check if user has typed anything
        if (typingInput.value.trim().length > 0) {
            endTypingTest();
        } else {
            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    // Set event listeners for buttons
    testButtons.forEach(button => {
       
        // button.addEventListener('click', () => startTypingTest(parseInt(button.dataset.duration)));
        button.addEventListener('click', () => {
            // Show timer
            timer.classList.add('visible');
            timer.classList.add('pulse');

            // Start the typing test
            const duration = parseInt(button.dataset.duration);
            startTypingTest(duration);

            // Focus on typing input
            typingInput.focus();
        });
    
    });

    // End test button event listener
    endTestBtn.addEventListener('click', endTypingTest);

    // Close modal button event listener
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            resultsModal.style.display = 'none';
        });
    }

    // Load high score on page load
    loadHighScore();
});