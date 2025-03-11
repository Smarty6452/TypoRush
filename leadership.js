document.addEventListener("DOMContentLoaded", () => {
    // Fetch the logged-in username from localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        // Set the username to the element with id="loggedInUser"
        document.getElementById("loggedInUser").textContent = ` ${loggedInUser}`;
    } else {
        
        window.location.href = "../pages/login.html";
    }
});
