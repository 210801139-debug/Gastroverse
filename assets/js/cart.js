// Cart Management

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCartHandler(foodId) {
  const food = getFoodById(foodId);

  if (!food) {
    alert("Food item not found!");
    return;
  }

  let cart = getCart();
  const existingItem = cart.find((item) => item.id === foodId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert("Item added to cart!");
}

// Remove item from cart
function removeFromCartHandler(foodId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== foodId);
  saveCart(cart);
  updateCartCount();
}

// Update item quantity
function updateQuantity(foodId, quantity) {
  let cart = getCart();
  const item = cart.find((item) => item.id === foodId);

  if (item) {
    if (quantity <= 0) {
      removeFromCartHandler(foodId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      updateCartCount();
    }
  }
}

// Calculate cart total
function calculateCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Get cart item count
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count display
function updateCartCount() {
  const count = getCartItemCount();
  const cartCountElements = document.querySelectorAll("#cartCount");
  cartCountElements.forEach((element) => {
    element.textContent = count;
  });
}

// Clear cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  
});
