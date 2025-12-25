// Food Data Management

// Initialize sample food data if not exists
function initializeSampleData() {
  const foods = JSON.parse(localStorage.getItem("foods"));

  if (!foods || foods.length === 0) {
    const sampleFoods = [
      {
        id: 1,
        name: "Butter Chicken",
        cuisine: "indian",
        price: 12.99,
        description: "Creamy tomato-based curry with tender chicken pieces",
        imageUrl: "assets/images/foods/indian/butter-chicken.jpg",
      },
      {
        id: 2,
        name: "Masala Dosa",
        cuisine: "south-indian",
        price: 8.99,
        description: "Crispy rice crepe filled with spiced potato masala",
        imageUrl: "assets/images/foods/south-indian/masala-dosa.jpg",
      },
      {
        id: 3,
        name: "Classic Burger",
        cuisine: "american",
        price: 10.99,
        description: "Juicy beef patty with lettuce, tomato, and cheese",
        imageUrl: "assets/images/foods/american/burger.jpg",
      },
      {
        id: 4,
        name: "Chocolate Brownie",
        cuisine: "desserts",
        price: 5.99,
        description: "Rich and fudgy chocolate brownie with vanilla ice cream",
        imageUrl: "assets/images/foods/desserts/brownie.jpg",
      },
    ];

    localStorage.setItem("foods", JSON.stringify(sampleFoods));
  }
}

// Get all food items
function getAllFoods() {
  return JSON.parse(localStorage.getItem("foods")) || [];
}

// Get food by ID
function getFoodById(id) {
  const foods = getAllFoods();
  return foods.find((food) => food.id === id);
}

// Get foods by cuisine
function getFoodsByCuisine(cuisine) {
  const foods = getAllFoods();
  return foods.filter((food) => food.cuisine === cuisine);
}

// Save food item
function saveFood(food) {
  const foods = getAllFoods();
  foods.push(food);
  localStorage.setItem("foods", JSON.stringify(foods));
}

// Update food item
function updateFood(id, updatedFood) {
  let foods = getAllFoods();
  const index = foods.findIndex((food) => food.id === id);
  if (index !== -1) {
    foods[index] = { ...foods[index], ...updatedFood };
    localStorage.setItem("foods", JSON.stringify(foods));
    return true;
  }
  return false;
}

// Delete food item
function deleteFood(id) {
  let foods = getAllFoods();
  foods = foods.filter((food) => food.id !== id);
  localStorage.setItem("foods", JSON.stringify(foods));
}

// Initialize data on load
initializeSampleData();
