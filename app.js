const encryptionKey = "secretkey";

function encrypt(data) {
    return btoa(data.split("").map(char => String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))).join(""));
}

function decrypt(data) {
    return atob(data).split("").map(char => String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))).join("");
}

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const userTable = document.getElementById("user-table");
const authorizationPage = document.getElementById("authorization-page");
const adminPage = document.getElementById("admin-page");
const userPage = document.getElementById("user-page");

const adminCredentials = { username: "admin", password: "Admin@123" };

// Обробка форми реєстрації
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        alert("Пароль повинен містити мінімум 8 символів, одну велику літеру, одну маленьку літеру, одну цифру та один спеціальний символ.");
        return;
    }

    const encryptedPassword = encrypt(password);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, password: encryptedPassword });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Користувача зареєстровано успішно!");
    registerForm.reset();
});

// Обробка форми авторизації
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
            alert("Невірні облікові дані");
        }
    }
});

document.getElementById("logout-admin").addEventListener("click", () => showPage("authorization"));
document.getElementById("logout-user").addEventListener("click", () => showPage("authorization"));

function showPage(page) {
    authorizationPage.style.display = page === "authorization" ? "block" : "none";
    adminPage.style.display = page === "admin" ? "block" : "none";
    userPage.style.display = page === "user" ? "block" : "none";
}

function populateUserTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    userTable.innerHTML = users.map(u => `
        <tr>
            <td>${u.username}</td>
            <td>${decrypt(u.password)}</td>
        </tr>
    `).join("");
}

// Показати/приховати пароль у формі авторизації
document.getElementById("show-password-login").addEventListener("change", function () {
    const passwordField = document.getElementById("password");
    passwordField.type = this.checked ? "text" : "password";
});

// Показати/приховати пароль у формі реєстрації
document.getElementById("show-password-register").addEventListener("change", function () {
    const passwordField = document.getElementById("reg-password");
    passwordField.type = this.checked ? "text" : "password";
});
