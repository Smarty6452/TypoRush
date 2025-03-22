"use strict"; // strict mode

$(document).ready(() => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const $topScoresContainer = $("#top-scores");
  const $userRankContainer = $("#user-rank");

  if (!loggedInUser) {
    window.location.href = "../pages/login.html";
    return;
  }

  $("#loggedInUser").text(loggedInUser);  // set text content

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  console.log("Leaderboard loaded:", leaderboard); // verify leaderboard data

  if (leaderboard.length === 0) {
    $topScoresContainer.html("<p>No scores available yet. Be the first to set a record!</p>");
    $userRankContainer.html("<p>Take a test to join the leaderboard!</p>");
  } else {
    // ensure leaderboard is sorted correctly 
    leaderboard.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    console.log("Sorted leaderboard:", leaderboard); //check sorted order

    // display top 10 scores
    leaderboard.slice(0, 10).forEach((entry, index) => {
      const rankClass = index === 0
        ? "top-1"
        : index === 1
        ? "top-2"
        : index === 2
        ? "top-3"
        : "";

      const $item = $("<div>").addClass("leaderboard-item").html(`
        <span class="leaderboard-rank ${rankClass}">${index + 1}. ${entry.username}</span>
        <span class="leaderboard-score ${rankClass}">${entry.score} WPM</span>
      `);

      $topScoresContainer.append($item);  // append dynamically generated HTML
    });

    // calculate and display current user's rank
    const userEntry = leaderboard.find(entry => entry.username === loggedInUser);
    if (userEntry) {
      const userRank = leaderboard.findIndex(entry => entry.username === loggedInUser) + 1;
      console.log(`User: ${loggedInUser}, Rank: ${userRank}, Score: ${userEntry.score}`);  // verify user rank

      $userRankContainer.html(`
        <span class="leaderboard-rank">Your Rank: ${userRank}</span>
      `);
    } else {
      $userRankContainer.html("<p>Take a test to join the leaderboard!</p>");
    }
  }
});
