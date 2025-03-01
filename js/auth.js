// Destructuring utility functions to modularity and resuability.
import { getStoredUserDetails, getLoggedInUser, saveUserDetails, clearUserSession, validateCredentials } from './utils.js';

// Collecting the reference of both forms and navbar
const getSigupForm = document.querySelector("#signUpForm");
const getLoginForm = document.querySelector("#loginForm");
const getNavActions = document.querySelector(".nav-actions");

// Dynamic Navbar Update
// Dynamic Navbar Update
const dynamicNav = () => {
    const loggedInUser = getLoggedInUser();  
    if (loggedInUser) {
        const storedUserDetails = getStoredUserDetails();
        // Use the username from the storedUserDetails
        getNavActions.innerHTML = `
            <div class="right-nav-detail">
                <span class="user-profile-text"> ${storedUserDetails.username}</span>
                <button class="btn logout-btn" id="logoutButton">Logout</button>
            </div>
        `;
        
        const logoutButton = document.getElementById("logoutButton");
        logoutButton?.addEventListener("click", handleLogout);
    } else {
        getNavActions.innerHTML = `
            <a href="pages/login.html" class="btn login-btn">Login</a>
        `;
    }
}



// Function for Sign-up
getSigupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const username = event.target.username.value.trim();
        const password = event.target.password.value.trim();

        validateCredentials(username, password); 

        saveUserDetails(username, password); 
        alert("Sign-up successful! Please log in.");
        getSigupForm.reset();
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
});

// Function for Login
getLoginForm?.addEventListener("submit", (event) => {
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
            window.location.href = "../index.html";
        } else {
            alert("Invalid username or password.");
        }
    } catch (error) {
        alert(error.message);
    }
});

// Logout Function
const handleLogout = () => {
    alert("Logging out...");
    clearUserSession(); // Clear session data
    alert("Logged out successfully!");
    window.location.href = "../pages/login.html";
};

document.addEventListener("DOMContentLoaded", () => {
    dynamicNav(); 
});
