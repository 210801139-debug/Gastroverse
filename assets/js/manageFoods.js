document.addEventListener("DOMContentLoaded", async () => {
  const menuItemsContainer = document.getElementById("menu-content");
  //   console.log("localStorage foods:", localStorage.getItem("foods"));

  if (localStorage.getItem("foods") == null) {
    let foods = await (async function fetchFoods() {
      const response = await fetch("../db.json");
      const data = await response.json();
      localStorage.setItem("foods", JSON.stringify(data.foods));
      return Object.keys(data.foods);
    })();
    //   console.log(foods);
  } else {
    let foodsData = JSON.parse(localStorage.getItem("foods"));
    var foods = Object.keys(foodsData);
  }

  function displayMenuItems(items) {
    menuItemsContainer.innerHTML = "";
    const foodsData = JSON.parse(localStorage.getItem("foods"));
    console.log("Displaying foodsData:", foodsData);
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
        itemDiv.className = "menu-item food-card";
        itemDiv.setAttribute("data-cuisine", item);
        itemDiv.innerHTML = `
          <img src="${food.image}" alt="${food.name}"> 
          <h3>${food.name}</h3>
          <p>${food.description}</p>
          <p>Stock: ${food.quantity}</p>
          <p class="price">Price: ₹${food.price.toFixed(2)}</p>
          <div class="button-group">
            <button class="edit-btn" data-id="${food.id}">Edit</button>
            <button class="delete-btn" data-id="${food.id}">Delete</button>
          </div>
        `;
        gridDiv.appendChild(itemDiv);

        // Edit button event
        const editBtn = itemDiv.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
          window.location.href = `../admin/add-food.html?foodId=${food.id}`;
        });

        // Delete button event
        const deleteBtn = itemDiv.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this item?")) {
            deleteFood(food.id);
          }
        });
      });

      menuItemsContainer.appendChild(gridDiv);
    });
  }

  function deleteFood(foodId) {
    let foodsData = JSON.parse(localStorage.getItem("foods"));

    // Find and delete from the appropriate cuisine category
    Object.keys(foodsData).forEach((cuisine) => {
      foodsData[cuisine] = foodsData[cuisine].filter(
        (food) => food.id !== foodId
      );
    });

    localStorage.setItem("foods", JSON.stringify(foodsData));
    displayMenuItems(foods); // Refresh display
  }

  // Expose refresh function globally for order completion
  window.refreshMenuAfterOrder = function () {
    const foodsData = JSON.parse(localStorage.getItem("foods"));
    const cuisines = Object.keys(foodsData);
    displayMenuItems(cuisines);
  };

  displayMenuItems(foods);
});
