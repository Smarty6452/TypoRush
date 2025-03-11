document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const topScoresContainer = document.getElementById("top-scores");
    const userRankContainer = document.getElementById("user-rank");

    if (!loggedInUser) {
        window.location.href = "../pages/login.html";
        return;
    }

    document.getElementById("loggedInUser").textContent = loggedInUser;
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log('Leaderboard loaded:', leaderboard); // Debug: Verify leaderboard data

    if (leaderboard.length === 0) {
        topScoresContainer.innerHTML = "<p>No scores available yet. Be the first to set a record!</p>";
        userRankContainer.innerHTML = "<p>Take a test to join the leaderboard!</p>";
    } else {
        // Ensure leaderboard is sorted correctly (redundant but for safety)
        leaderboard.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
        console.log('Sorted leaderboard:', leaderboard); // Debug: Check sorted order

        // Display top 10 scores
        leaderboard.forEach((entry, index) => {
            const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';
            const item = document.createElement("div");
            item.classList.add("leaderboard-item");
            item.innerHTML = `
                <span class="leaderboard-rank ${rankClass}">${index + 1}. ${entry.username}</span>
                <span class="leaderboard-score ${rankClass}">${entry.score} WPM</span>
            `;
            topScoresContainer.appendChild(item);
        });

        // Calculate and display current user's rank
        const userEntry = leaderboard.find(entry => entry.username === loggedInUser);
        if (userEntry) {
            const userRank = leaderboard.findIndex(entry => entry.username === loggedInUser) + 1;
            console.log(`User: ${loggedInUser}, Rank: ${userRank}, Score: ${userEntry.score}`); // Debug: Verify user rank
            userRankContainer.innerHTML = `
                <span class="leaderboard-rank ">Your Rank: ${userRank} </span> 
               
            `;
        } else {
            userRankContainer.innerHTML = "<p>Take a test to join the leaderboard!</p>";
        }
    }
});