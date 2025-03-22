"use strict"; // strict mode

// get stored user details from localStorage
const getStoredUserDetails = () => {
  return JSON.parse(localStorage.getItem("userDetails"));
};

// get the logged-in user from localStorage
const getLoggedInUser = () => {
  return localStorage.getItem("loggedInUser");
};

// save user details to localStorage
const saveUserDetails = (username, password) => {
  const userDetails = { username, password };
  localStorage.setItem("userDetails", JSON.stringify(userDetails));
};

// clear user session (remove user details and logged-in user)
const clearUserSession = () => {
  localStorage.removeItem("userDetails");
  localStorage.removeItem("loggedInUser");

  // jQuery to show logout alert (optional, depending on usage)
  $("#logout-alert").text("You have successfully logged out!").fadeIn().delay(3000).fadeOut();
};

// validate credentials before saving or logging in
const validateCredentials = (username, password) => {
  if (!username || !password) {
    // jQuery to display error message (optional, for better UI feedback)
    $("#error-message").text("All fields are required!").fadeIn().delay(3000).fadeOut();
    throw new Error("All fields are required!");
  }
};

export {
  getStoredUserDetails,
  getLoggedInUser,
  saveUserDetails,
  clearUserSession,
  validateCredentials,
};
