// User Logic

// Load menu items
function loadMenuItems(filter = "all") {
  const foods = JSON.parse(localStorage.getItem("foods")) || [];
  const menuItems = document.getElementById("menuItems");

  if (menuItems) {
    menuItems.innerHTML = "";
    const filteredFoods =
      filter === "all"
        ? foods
        : foods.filter((food) => food.cuisine === filter);

    filteredFoods.forEach((food) => {
      const foodCard = document.createElement("div");
      foodCard.className = "food-card";
      foodCard.innerHTML = `
                <img src="${food.imageUrl}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>${food.cuisine}</p>
                <p class="price">$${food.price}</p>
                <button onclick="addToCart(${food.id})">Add to Cart</button>
            `;
      menuItems.appendChild(foodCard);
    });
  }
}

// Add to cart function
function addToCart(foodId) {
  const foods = JSON.parse(localStorage.getItem("foods")) || [];
  const food = foods.find((f) => f.id === foodId);

  if (food) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === foodId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...food, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
  }
}

// Update cart count in navigation
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll("#cartCount");
  cartCountElements.forEach((el) => (el.textContent = totalItems));
}

// Load cart items
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>Item Name : ${item.name}</h3>
                    <p>Cost Per Piece: ₹${item.price} </p>
                    <p>Quantity: ${item.quantity} </p>
                    <p>Total: ₹${itemTotal.toFixed(2)}</p>
                </div>
                <div class="qty-controls">
                      <button onclick="updateCartItemQuantity(${
                        item.id
                      }, -1)">-</button>
                      <span>${item.quantity}</span>
                      <button onclick="updateCartItemQuantity(${
                        item.id
                      }, 1)">+</button>
                    </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
      cartItems.appendChild(cartItem);
    });

    if (cartTotal) {
      cartTotal.textContent = total.toFixed(2);
    }
  }
}

// Remove from cart
function removeFromCart(foodId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== foodId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

// Proceed to checkout
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "order.html";
}

// Select order type
function selectOrderType(type) {
  sessionStorage.setItem("orderType", type);

  if (type === "delivery") {
    document.getElementById("deliveryForm").style.display = "block";
  } else {
    confirmOrder();
  }
}

// Confirm order
function confirmOrder() {
  const orderType = sessionStorage.getItem("orderType");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const order = {
    id: Date.now(),
    items: cart,
    orderType: orderType,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString(),
    status: "pending",
  };

  if (orderType === "delivery") {
    order.address = document.getElementById("address").value;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("cart");

  alert("Order placed successfully!");
  window.location.href = "orders.html";
}

// Load user orders
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const ordersList = document.getElementById("ordersList");

  if (ordersList) {
    ordersList.innerHTML = "";

    if (orders.length === 0) {
      ordersList.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.className = "order-card";
      orderCard.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p>Date: ${order.date}</p>
                <p>Type: ${order.orderType}</p>
                <p>Total: ₹${order.total.toFixed(2)}</p>
                <p>Status: ${order.status}</p>
                ${order.address ? `<p>Address: ${order.address}</p>` : ""}
            `;
      ordersList.appendChild(orderCard);
    });
  }
}

// Adjust quantity (delta = +1 or -1)
function updateCartItemQuantity(foodId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart
    .map((item) =>
      item.id === foodId ? { ...item, quantity: item.quantity + delta } : item
    )
    .filter((item) => item.quantity > 0); // drop items at 0 or less

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Load menu if on menu page
  if (document.getElementById("menuItems")) {
    loadMenuItems();

    // Add filter listener
    const cuisineFilter = document.getElementById("cuisineFilter");
    if (cuisineFilter) {
      cuisineFilter.addEventListener("change", (e) => {
        loadMenuItems(e.target.value);
      });
    }
  }

  // Load cart if on cart page
  if (document.getElementById("cartItems")) {
    loadCartItems();
  }

  // Load orders if on orders page
  if (document.getElementById("ordersList")) {
    loadOrders();
  }
});
