"use strict"; // strict mode

// Destructuring utility functions for modularity and reusability
import {
  getStoredUserDetails,
  getLoggedInUser,
  saveUserDetails,
  clearUserSession,
  validateCredentials,
} from "./utils.js";

// Collecting references for forms and navbar
const getSignupForm = $("#signUpForm"); //  Sign-up form element
const getLoginForm = $("#loginForm"); //  Login form element
const getNavActions = $(".nav-actions"); //  Navbar action elements

// Dynamic Navbar Update
const dynamicNav = () => {
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    const storedUserDetails = getStoredUserDetails();
    getNavActions.html(`  // Query: Updating navbar with logged-in user details
      <div class="right-nav-detail">
        <span class="user-profile-text">${storedUserDetails.username}</span>
        <button class="btn logout-btn" id="logoutButton">Logout</button>
      </div>
    `);

    $("#logoutButton").on("click", handleLogout); //  Logout button click handler
  } else {
    getNavActions.html(`  // Query: Updating navbar for logged-out user
      <a href="login.html" class="btn login-btn">Login</a>
    `);
  }
};

// Sign-up Function
getSignupForm?.on("submit", (event) => {  //Sign-up form submission
  event.preventDefault();
  try {
    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();

    validateCredentials(username, password);

    saveUserDetails(username, password);
    alert("Sign-up successful! Please log in.");
    getSignupForm[0].reset(); // Reset the sign-up form
    window.location.href = "login.html";
  } catch (error) {
    alert(error.message);
  }
});

// Login Function
getLoginForm?.on("submit", (event) => {  // Login form submission
  event.preventDefault();
  try {
    const username = event.target.username.value.trim();
    const password = event.target.password.value.trim();

    const storedUserDetails = getStoredUserDetails();

    if (
      storedUserDetails &&
      storedUserDetails.username === username &&
      storedUserDetails.password === password
    ) {
      alert("Login Successful");
      localStorage.setItem("loggedInUser", username);
      window.location.href = "index.html";
    } else {
      alert("Invalid username or password.");
    }
  } catch (error) {
    alert(error.message);
  }
});

// Logout Function
const handleLogout = () => {  // Handling logout functionality
  alert("Logging out...");
  clearUserSession();
  alert("Logged out successfully!");
  window.location.href = "login.html";
};

$(document).ready(() => {  //Document ready
  dynamicNav();
});
