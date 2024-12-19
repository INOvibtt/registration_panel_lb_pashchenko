// Symmetric encryption key
const encryptionKey = "secretkey";

// Function to encrypt data
function encrypt(data) {
    return btoa(data.split("").map(char => String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))).join(""));
}

// Function to decrypt data
function decrypt(data) {
    return atob(data).split("").map(char => String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))).join("");
}

// References to DOM elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const userTable = document.getElementById("user-table");
const authorizationPage = document.getElementById("authorization-page");
const adminPage = document.getElementById("admin-page");
const userPage = document.getElementById("user-page");

// Admin credentials (stored in database)
const adminCredentials = { username: "admin", password: "admin123" };

// Event: Register User
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const password = encrypt(document.getElementById("reg-password").value);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("User registered successfully!");
    registerForm.reset();
});

// Event: Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        showPage("admin");
        populateUserTable();
    } else {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username && decrypt(u.password) === password);

        if (user) {
            showPage("user");
        } else {
            alert("Invalid credentials");
        }
    }
});

// Logout buttons
document.getElementById("logout-admin").addEventListener("click", () => showPage("authorization"));
document.getElementById("logout-user").addEventListener("click", () => showPage("authorization"));

// Show specific page
function showPage(page) {
    authorizationPage.style.display = page === "authorization" ? "block" : "none";
    adminPage.style.display = page === "admin" ? "block" : "none";
    userPage.style.display = page === "user" ? "block" : "none";
}

// Populate admin table
function populateUserTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    userTable.innerHTML = users.map(u => `
        <tr>
            <td>${u.username}</td>
            <td>${decrypt(u.password)}</td>
        </tr>
    `).join("");
}
