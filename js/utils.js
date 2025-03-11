const getStoredUserDetails = () => {
    return JSON.parse(localStorage.getItem("userDetails"));
};

const getLoggedInUser = () => {
    return localStorage.getItem("loggedInUser");
};

const saveUserDetails = (username, password) => {
    const userDetails = { username, password };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
};

const clearUserSession = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("loggedInUser");
};

const validateCredentials = (username, password) => {
    if (!username || !password) {
        throw new Error("All fields are required!");
    }
};

export { getStoredUserDetails, getLoggedInUser, saveUserDetails, clearUserSession, validateCredentials };