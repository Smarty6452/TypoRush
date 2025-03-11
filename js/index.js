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

    timerDisplay.classList.remove('visible');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function renderTypingText(text) {
        typingTextElement.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            typingTextElement.appendChild(span);
        }
    }

    function startTypingTest(duration) {
        resetTest();
        remainingTime = duration * 60;
        const typingText = typingTexts[duration];
        renderTypingText(typingText);
        startTime = Date.now();
        isTestActive = true;
        startTimer();
        typingInput.focus();
        typingInput.addEventListener('input', handleTypingInput);
        document.querySelector('.typing-test').scrollIntoView({ behavior: 'smooth' });
    }

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

        if (typedChar !== undefined) {
            charIndex++;
            if (charIndex < spanElements.length) {
                spanElements[charIndex].classList.add('active');
            }
        }
        updateWPM();
        updateAccuracy();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                timerDisplay.textContent = `Time Left: ${remainingTime}s`;
            } else {
                endTypingTest();
                timerDisplay.classList.remove('visible', 'pulse');
            }
        }, 1000);
    }

    function updateWPM() {
        const wordsTyped = Math.floor((charIndex - mistakes) / 5);
        const elapsedTimeInMinutes = (Date.now() - startTime) / 60000;
        const wpm = Math.round(wordsTyped / elapsedTimeInMinutes);
        wpmDisplay.textContent = wpm > 0 ? wpm : 0;
        mistakesDisplay.textContent = mistakes;
    }

    function updateAccuracy() {
        const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;
        accuracyDisplay.textContent = ` ${accuracy}%`;
    }

    function saveHighScore(wpm) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) return;

        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        console.log('Before update:', leaderboard); // Debug: Check current leaderboard

        const existingEntryIndex = leaderboard.findIndex(entry => entry.username === loggedInUser);
        if (existingEntryIndex !== -1) {
            if (wpm > leaderboard[existingEntryIndex].score) {
                leaderboard[existingEntryIndex].score = wpm;
                leaderboard[existingEntryIndex].timestamp = Date.now();
            }
        } else {
            leaderboard.push({ username: loggedInUser, score: wpm, timestamp: Date.now() });
        }

        // Sort by score (descending), then timestamp (earlier wins in ties)
        leaderboard.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
        leaderboard = leaderboard.slice(0, 10); // Keep top 10

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        console.log('After update:', leaderboard); // Debug: Verify updated leaderboard

        loadHighScore();
    }

    function loadHighScore() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const userEntry = leaderboard.find(entry => entry.username === loggedInUser);
        const userHighScore = userEntry ? userEntry.score : 0;
        highScoreDisplay.textContent = ` ${userHighScore} WPM`;
    }

    function endTypingTest() {
        if (!isTestActive) return;
        isTestActive = false;
        clearInterval(timerInterval);
        timerDisplay.classList.remove('visible', 'pulse');

        const elapsedTimeInSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        const timeTaken = formatTime(elapsedTimeInSeconds);
        const wordsTyped = Math.floor((charIndex - mistakes) / 5);
        const elapsedTimeInMinutes = elapsedTimeInSeconds / 60;
        const wpm = Math.round(wordsTyped / elapsedTimeInMinutes);
        const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;

        saveHighScore(wpm);

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

        resultsModal.style.display = 'block';
    }

    function resetTest() {
        charIndex = mistakes = 0;
        typingInput.value = '';
        typingInput.removeEventListener('input', handleTypingInput);
        renderTypingText("");
        timerDisplay.textContent = 'Time Left: 0s';
        wpmDisplay.textContent = '0';
        mistakesDisplay.textContent = '0';
        accuracyDisplay.textContent = 'Accuracy: 100%';
        isTestActive = false;
    }

    endTestBtn.addEventListener('click', () => {
        if (typingInput.value.trim().length > 0) {
            endTypingTest();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    testButtons.forEach(button => {
        button.addEventListener('click', () => {
            timerDisplay.classList.add('visible', 'pulse');
            const duration = parseInt(button.dataset.duration);
            startTypingTest(duration);
            typingInput.focus();
        });
    });

    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            resultsModal.style.display = 'none';
        });
    }

    loadHighScore();
});