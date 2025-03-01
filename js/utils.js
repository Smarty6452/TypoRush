// utils.js

// Get stored user data from localStorage
const getStoredUserDetails = () => {
    return JSON.parse(localStorage.getItem("userDetails"));
};

// Get the currently logged-in user (if any)
const getLoggedInUser = () => {
    return localStorage.getItem("loggedInUser");
};

// Save user data to localStorage
const saveUserDetails = (username, password) => {
    const userDetails = { username, password };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
};

// Clear all user session data (logout)
const clearUserSession = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("loggedInUser");
};

// Validate username and password (ensure they're not empty)
const validateCredentials = (username, password) => {
    if (!username || !password) {
        throw new Error("All fields are required!");
    }
};

// Exporting functions to be used elsewhere
export { getStoredUserDetails, getLoggedInUser, saveUserDetails, clearUserSession, validateCredentials };
