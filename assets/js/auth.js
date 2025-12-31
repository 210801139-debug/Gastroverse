// Authentication Logic

// Default admin credentials
const ADMIN_EMAIL = "admin@gastroverse.com";
const ADMIN_PASSWORD = "admin123";

// Handle login
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in all fields!");
    return;
  }
  // Check if admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("userRole", "admin");
    sessionStorage.setItem("userEmail", email);
    alert("Welcome Admin!");
    window.location.href = "admin/admin-dashboard.html";
    return;
  }

  // Check registered users
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    sessionStorage.setItem("userRole", "user");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userName", user.name);
    alert("Login successful!");
    window.location.href = "user/menu.html";
  } else {
    alert("Invalid credentials!");
  }
});

// Handle registration
document
  .getElementById("registerForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;

    if (!name || !email || !password || !phone) {
      alert("Please fill in all fields!");
      return;
    }

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      alert("User already exists with this email!");
      return;
    }

    // Add new user
    users.push({ name, email, password, phone });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  });

// Check authentication on page load
function checkAuth(requiredRole) {
  const userRole = sessionStorage.getItem("userRole");

  if (!userRole) {
    window.location.href = "../login.html";
    return false;
  }

  if (requiredRole && userRole !== requiredRole) {
    alert("Access denied!");
    window.location.href = "../index.html";
    return false;
  }

  return true;
}
