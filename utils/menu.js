document.addEventListener("DOMContentLoaded", async () => {
  const menuItemsContainer = document.getElementById("menu-content");

  let foods = await (async function fetchFoods() {
    const response = await fetch("../db.json");
    const data = await response.json();
    localStorage.setItem("foods", JSON.stringify(data.foods));
    return Object.keys(data.foods);
  })();

  // Get cart from localStorage
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Update cart count in header
  function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById("cartCount");
    cartCount.textContent = cart.length;
  }

  // Add item to cart
  function addToCart(foodItem) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === foodItem.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...foodItem,
        quantity: 1,
      });
    }

    saveCart(cart);
    alert(`${foodItem.name} added to cart!`);
    console.log("Cart updated:", cart);
  }

  function displayMenuItems(items) {
    menuItemsContainer.innerHTML = "";
    const foodsData = JSON.parse(localStorage.getItem("foods"));

    items.forEach((item) => {
      const headingDiv = document.createElement("div");
      headingDiv.className = "cuisine-heading";
      headingDiv.innerHTML = `<h2>${
        item.charAt(0).toUpperCase() + item.slice(1)
      }</h2>`;
      menuItemsContainer.appendChild(headingDiv);

      const gridDiv = document.createElement("div");
      gridDiv.className = "menu-grid";
      gridDiv.id = "menuItems";

      foodsData[item].forEach((food) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item food-card"; // Added food-card class
        itemDiv.setAttribute("data-cuisine", item); // Added cuisine attribute for filtering
        itemDiv.innerHTML = `
          <img src="${food.image}" alt="${food.name}"> 
          <h3>${food.name}</h3>
          <p>${food.description}</p>
          <p class="price">Price: ₹${food.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${food.id}" data-name="${
          food.name
        }" data-price="${food.price}" data-image="${
          food.image
        }">Add to Cart</button>
        `;
        gridDiv.appendChild(itemDiv);
        menuItemsContainer.appendChild(gridDiv);
        // Add click event to button
        const btn = itemDiv.querySelector(".add-to-cart");
        btn.addEventListener("click", () => {
          addToCart({
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            description: food.description,
          });
        });
      });
    });
  }

  // NEW CHECKBOX FILTERING LOGIC
  function setupCheckboxFilters() {
    const checkboxes = document.querySelectorAll(".cuisine-checkbox");

    if (!checkboxes.length) {
      console.log("No checkboxes found, skipping filter setup");
      return;
    }

    // Individual checkbox changes
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", applyFilters);
    });

    function applyFilters() {
      const activeFilters = Array.from(checkboxes)
        .filter((cb) => cb.checked && cb.value !== "all")
        .map((cb) => cb.value);

      console.log("Active Filters:", activeFilters);
      // Filter existing menu items by data-cuisine attribute
      if (activeFilters.length === 0) {
        displayMenuItems(foods);
      } else {
        displayMenuItems(activeFilters);
      }
    }
  }

  // Initial display
  displayMenuItems(foods.length ? foods : []);
  updateCartCount();

  // Setup checkbox filters after menu loads
  setupCheckboxFilters();
});
