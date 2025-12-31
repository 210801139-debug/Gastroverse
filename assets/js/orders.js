// Order Management

// Get all orders
function getAllOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// Save orders
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Create new order
function createOrder(orderType, address = null) {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Cart is empty!");
    return false;
  }

  const order = {
    id: Date.now(),
    userId: sessionStorage.getItem("userEmail"),
    userName: sessionStorage.getItem("userName"),
    items: cart,
    orderType: orderType,
    total: calculateCartTotal(),
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleString(),
    status: "pending",
  };

  if (orderType === "delivery" && address) {
    order.address = address;
  }

  const orders = getAllOrders();
  orders.push(order);
  saveOrders(orders);

  // Reduce quantities in localStorage
  reduceInventoryQuantities(cart);

  clearCart();
  return true;
}

// Reduce food quantities based on order items
function reduceInventoryQuantities(cartItems) {
  let foods = JSON.parse(localStorage.getItem("foods")) || {};

  // Update quantities for each item in the order
  cartItems.forEach((cartItem) => {
    Object.keys(foods).forEach((cuisine) => {
      foods[cuisine] = foods[cuisine].map((food) => {
        if (food.id === cartItem.id) {
          food.quantity = Math.max(0, food.quantity - cartItem.quantity);
        }
        return food;
      });
    });
  });

  localStorage.setItem("foods", JSON.stringify(foods));
  console.log("Inventory updated in localStorage:", foods);
}

// Get user orders
function getUserOrders() {
  const userEmail = sessionStorage.getItem("userEmail");
  const orders = getAllOrders();
  return orders.filter((order) => order.userId === userEmail);
}

// Get order by ID
function getOrderById(orderId) {
  const orders = getAllOrders();
  return orders.find((order) => order.id === orderId);
}

// Update order status
function updateOrderStatus(orderId, status) {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === orderId);

  if (order) {
    order.status = status;
    saveOrders(orders);
    return true;
  }

  return false;
}

// Cancel order
function cancelOrder(orderId) {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === orderId);

  if (order && order.status === "pending") {
    order.status = "cancelled";
    saveOrders(orders);
    return true;
  }

  return false;
}

// Get order statistics
function getOrderStats() {
  const orders = getAllOrders();

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.total, 0),
  };
}
