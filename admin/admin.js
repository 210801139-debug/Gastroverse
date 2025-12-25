// Admin Logic

// Add food item
function addFoodItem(e) {
  e.preventDefault();
  const foodItem = {
    id: Date.now(),
    name: document.getElementById("foodName").value,
    cuisine: document.getElementById("cuisine").value,
    price: parseFloat(document.getElementById("price").value),
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  // Save to localStorage
  const foods = JSON.parse(localStorage.getItem("foods")) || [];
  foods.push(foodItem);
  localStorage.setItem("foods", JSON.stringify(foods));

  alert("Food item added successfully!");
  e.target.reset();
}

// Load food items for management
function loadFoodItems() {
  const foods = JSON.parse(localStorage.getItem("foods")) || [];
  const foodList = document.getElementById("foodList");

  if (foodList) {
    foodList.innerHTML = "";
    foods.forEach((food) => {
      const foodCard = document.createElement("div");
      foodCard.className = "food-card";
      foodCard.innerHTML = `
                <img src="${food.imageUrl}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>${food.cuisine}</p>
                <p>$${food.price}</p>
                <button onclick="deleteFood(${food.id})">Delete</button>
            `;
      foodList.appendChild(foodCard);
    });
  }
}

// Delete food item
function deleteFood(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    let foods = JSON.parse(localStorage.getItem("foods")) || [];
    foods = foods.filter((food) => food.id !== id);
    localStorage.setItem("foods", JSON.stringify(foods));
    loadFoodItems();
  }
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
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    document.getElementById("totalFoodItems").textContent = foods.length;
    document.getElementById("totalOrders").textContent = orders.length;
  }
});
