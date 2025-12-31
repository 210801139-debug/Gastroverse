// Admin Logic

// Add food item
function addFoodItem(e) {
  e.preventDefault();
  const foodItem = {
    id: parseInt(Date.now()),
    name: document.getElementById("foodName").value,
    quantity: parseInt(document.getElementById("quantity").value),
    cuisine: document.getElementById("cuisine").value,
    price: parseFloat(document.getElementById("price").value),
    description: document.getElementById("description").value,
    image: document.getElementById("imageUrl").value,
  };
  if (isNaN(foodItem.quantity) || foodItem.quantity <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  if (isNaN(foodItem.price) || foodItem.price <= 0) {
    alert("Please enter a valid price.");
    return;
  }
  if (!foodItem.cuisine) {
    alert("Please select a cuisine.");
    return;
  }
  if (!foodItem.name) {
    alert("Please enter a food name.");
    return;
  }
  if (!foodItem.description) {
    alert("Please enter a description.");
    return;
  }
  if (!foodItem.image) {
    alert("Please enter an image URL.");
    return;
  }

  // Save to localStorage with categorized structure
  let foods = JSON.parse(localStorage.getItem("foods")) || {
    "South Indian": [],
    "North Indian": [],
    Asian: [],
    Western: [],
    Italian: [],
    Beverages: [],
    "Fresh Juices": [],
    Desserts: [],
  };

  if (!foods[foodItem.cuisine]) {
    foods[foodItem.cuisine] = [];
  }

  foods[foodItem.cuisine].push(foodItem);
  localStorage.setItem("foods", JSON.stringify(foods));

  alert("Food item added successfully!");
  e.target.reset();
}

// Load food items for management
function loadFoodItems() {
  const foods = JSON.parse(localStorage.getItem("foods")) || {};
  const foodList = document.getElementById("foodList");

  if (foodList) {
    foodList.innerHTML = "";

    // Iterate through all cuisine categories
    Object.entries(foods).forEach(([cuisine, items]) => {
      if (Array.isArray(items)) {
        items.forEach((food) => {
          const foodCard = document.createElement("div");
          foodCard.className = "food-card";
          foodCard.innerHTML = `
                <img src="${food.image}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>${food.cuisine}</p>
                <p>₹${food.price}</p>
                <p>Stock: ${food.quantity}</p>
                <button onclick="editFoodItem(${food.id})">Edit</button>
                <button onclick="deleteFood(${food.id})">Delete</button>
            `;
          foodList.appendChild(foodCard);
        });
      }
    });
  }
}

// Delete food item
function deleteFood(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    let foods = JSON.parse(localStorage.getItem("foods")) || {};

    // Find and delete from the correct cuisine category
    Object.keys(foods).forEach((cuisine) => {
      foods[cuisine] = foods[cuisine].filter((food) => food.id !== id);
    });

    localStorage.setItem("foods", JSON.stringify(foods));
    loadFoodItems();
  }
}

// Edit food item - redirect to form
function editFoodItem(foodId) {
  window.location.href = `add-food.html?foodId=${foodId}`;
}

// Edit food item form setup
const form = document.getElementById("addFoodForm");
const submitBtn = document.getElementById("submitBtn");
const pageTitle = document.getElementById("pageTitle");
let editingFoodId = null;

// Check if editing (get foodId from URL params)
const urlParams = new URLSearchParams(window.location.search);
editingFoodId = urlParams.get("foodId");

if (editingFoodId) {
  // Load food data for editing
  loadFoodForEdit(parseInt(editingFoodId));
  if (pageTitle) pageTitle.textContent = "Edit Food Item";
  if (submitBtn) submitBtn.textContent = "Update Food Item";
}

function loadFoodForEdit(foodId) {
  const foods = JSON.parse(localStorage.getItem("foods")) || {};
  let food = null;

  // Search through all cuisine categories
  Object.entries(foods).forEach(([cuisine, items]) => {
    if (Array.isArray(items)) {
      const found = items.find((f) => f.id === foodId);
      if (found) food = found;
    }
  });

  if (food) {
    const nameField = document.getElementById("foodName");
    const qtyField = document.getElementById("quantity");
    const cuisineField = document.getElementById("cuisine");
    const priceField = document.getElementById("price");
    const descField = document.getElementById("description");
    const imgField = document.getElementById("imageUrl");

    if (nameField) nameField.value = food.name;
    if (qtyField) qtyField.value = food.quantity || "";
    if (cuisineField) cuisineField.value = food.cuisine || "";
    if (priceField) priceField.value = food.price;
    if (descField) descField.value = food.description;
    if (imgField) imgField.value = food.image;
  }
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const foodData = {
      name: document.getElementById("foodName").value,
      quantity: parseInt(document.getElementById("quantity").value),
      cuisine: document.getElementById("cuisine").value,
      price: parseFloat(document.getElementById("price").value),
      description: document.getElementById("description").value,
      image: document.getElementById("imageUrl").value,
    };

    if (editingFoodId) {
      updateFood(parseInt(editingFoodId), foodData);
    } else {
      addFood(foodData);
    }
  });
}

function addFood(foodData) {
  let foods = JSON.parse(localStorage.getItem("foods")) || {
    "South Indian": [],
    "North Indian": [],
    Asian: [],
    Western: [],
    Italian: [],
    Beverages: [],
    "Fresh Juices": [],
    Desserts: [],
  };

  foodData.id = parseInt(Date.now());

  if (!foods[foodData.cuisine]) {
    foods[foodData.cuisine] = [];
  }

  foods[foodData.cuisine].push(foodData);
  localStorage.setItem("foods", JSON.stringify(foods));
  alert("Food item added successfully!");
  form.reset();
  window.location.href = "manage-food.html";
}

function updateFood(foodId, foodData) {
  let foods = JSON.parse(localStorage.getItem("foods")) || {};
  // console.log("Foods before update:", foods);
  // console.log("Updating foodId:", foodId, "with data:", foodData);
  let updated = false;

  // Find the food in its current category and update it
  Object.keys(foods).forEach((cuisine) => {
    console.log("Checking cuisine:", cuisine);
    foods[cuisine] = foods[cuisine].map((f) => {
      if (f.id === foodId) {
        // console.log("Found food to update:", f);
        updated = true;
        return { ...f, ...foodData };
      }
      return f;
    });
  });

  console.log("Foods after update attempt:", foods);

  if (updated) {
    localStorage.setItem("foods", JSON.stringify(foods));
    // Sync updated data back to db.json
    syncToDatabase(foods);
    alert("Food item updated successfully!");
    // window.location.href = "manage-food.html";
  } else {
    alert("Food item not found for update.");
  }
}

function syncToDatabase(foods) {
  // Create the database structure
  // console.log("Syncing to database with foods:", foods);
  // Send the updated data to db.json via a backend endpoint
  // For now, we'll store it in localStorage as a backup
  // In production, this should POST to a server endpoint
  localStorage.setItem("foods", JSON.stringify(foods));
  console.log(localStorage.getItem("foods"));

  // If you have a backend server, uncomment and use:
  // fetch("../db.json", {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(dbData)
  // }).catch(err => console.error("Failed to sync to db.json:", err));
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const addFoodForm = document.getElementById("addFoodForm");
  if (addFoodForm) {
    addFoodForm.addEventListener("submit", addFoodItem);
  }

  // Load food items if on manage page
  if (document.getElementById("foodList")) {
    loadFoodItems();
  }

  // Update dashboard stats
  if (document.getElementById("totalFoodItems")) {
    const foods = JSON.parse(localStorage.getItem("foods")) || {};
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    let totalFoods = 0;
    Object.values(foods).forEach((items) => {
      if (Array.isArray(items)) totalFoods += items.length;
    });

    document.getElementById("totalFoodItems").textContent = totalFoods;
    document.getElementById("totalOrders").textContent = orders.length;
  }
});
