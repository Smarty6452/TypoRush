document.addEventListener('DOMContentLoaded', () => {
    const typingTextElement = document.querySelector('.typing-text');
    const typingInput = document.querySelector('#typing-input');
    const wpmDisplay = document.querySelector('#wpm');
    const mistakesDisplay = document.querySelector('#mistakes');
    const timerDisplay = document.querySelector('#timer');
    const endTestBtn = document.querySelector('#end-test-btn');
    const testButtons = document.querySelectorAll('.test-btn');

    const typingText = "The quick brown fox jumps over the lazy dog.";
    let timerInterval;
    let remainingTime = 60;
    let mistakes = 0;
    let charIndex = 0;

    // Render typing text with span for each character
    function renderTypingText() {
        typingTextElement.innerHTML = typingText.split("").map(char => `<span>${char}</span>`).join("");
    }

    // Initialize the typing test
    function startTypingTest(duration) {
        resetTest();
        remainingTime = duration * 60;
        renderTypingText();
        startTimer();
        typingInput.focus();
        typingInput.addEventListener('input', handleTypingInput);
    }

    // Handle typing input
    function handleTypingInput() {
        const typedChar = typingInput.value[charIndex];
        const spanElements = typingTextElement.querySelectorAll('span');
        const currentCharSpan = spanElements[charIndex];

        if (typedChar === currentCharSpan.textContent) {
            currentCharSpan.classList.add('correct');
        } else if (typedChar !== undefined) {
            currentCharSpan.classList.add('incorrect');
            mistakes++;
        }
        if (typedChar !== undefined) charIndex++;
        updateWPM();
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
            }
        }, 1000);
    }

    // Calculate and update WPM
    function updateWPM() {
        const wordsTyped = Math.floor((charIndex - mistakes) / 5);
        const wpm = Math.round((wordsTyped / (60 - remainingTime)) * 60);
        wpmDisplay.textContent = wpm > 0 ? wpm : 0;
        mistakesDisplay.textContent = mistakes;
    }

    // End typing test
    function endTypingTest() {
        clearInterval(timerInterval);
        alert(`Test Complete! You typed ${charIndex} characters with ${mistakes} mistakes.`);
        resetTest();
    }

    // Reset test
    function resetTest() {
        charIndex = mistakes = 0;
        typingInput.value = '';
        renderTypingText();
        timerDisplay.textContent = 'Time Left: 0s';
        wpmDisplay.textContent = '0';
        mistakesDisplay.textContent = '0';
    }

    // Set event listeners for buttons
    testButtons.forEach(button => {
        button.addEventListener('click', () => startTypingTest(parseInt(button.dataset.duration)));
    });

    endTestBtn.addEventListener('click', endTypingTest);
});
