// Helper Functions for GastroVerse

// Format price with currency symbol
function formatPrice(price) {
  return `${CURRENCY_SYMBOL}${parseFloat(price).toFixed(2)}`;
}

// Format date
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format cuisine name
function formatCuisineName(cuisine) {
  return CUISINE_LABELS[cuisine] || capitalizeFirstLetter(cuisine);
}

// Format order type
function formatOrderType(orderType) {
  return orderType
    .split("-")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

// Get order status badge class
function getOrderStatusClass(status) {
  const classes = {
    pending: "badge-warning",
    preparing: "badge-info",
    ready: "badge-success",
    delivered: "badge-success",
    completed: "badge-success",
    cancelled: "badge-danger",
  };
  return classes[status] || "badge-secondary";
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
}

// Calculate discount
function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent) / 100;
}

// Check if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem("userRole") !== null;
}

// Check if user is admin
function isAdmin() {
  return sessionStorage.getItem("userRole") === USER_ROLES.ADMIN;
}

// Get current user
function getCurrentUser() {
  return {
    email: sessionStorage.getItem("userEmail"),
    name: sessionStorage.getItem("userName"),
    role: sessionStorage.getItem("userRole"),
  };
}

// Logout user
function logout() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}

// Show alert message
function showAlert(message, type = "info") {
  alert(message);
  // Can be enhanced with custom alert/toast notifications
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Local storage helper
const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Error writing to localStorage:", e);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error("Error removing from localStorage:", e);
      return false;
    }
  },
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("Error clearing localStorage:", e);
      return false;
    }
  },
};
