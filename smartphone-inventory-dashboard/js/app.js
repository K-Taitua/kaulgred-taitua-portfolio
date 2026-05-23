const products = [
  { id: 1, brand: "Apple", model: "iPhone 16 Pro", storage: "256GB", price: 2199, cost: 1399, stock: 10, sold: 36, updated: "25 May 2025, 10:45 AM" },
  { id: 2, brand: "Apple", model: "iPhone 16", storage: "128GB", price: 1499, cost: 929, stock: 13, sold: 32, updated: "25 May 2025, 10:45 AM" },
  { id: 3, brand: "Samsung", model: "Galaxy S25 Ultra", storage: "256GB", price: 2399, cost: 1779, stock: 5, sold: 35, updated: "25 May 2025, 10:45 AM" },
  { id: 4, brand: "Samsung", model: "Galaxy S25", storage: "256GB", price: 1899, cost: 1399, stock: 8, sold: 29, updated: "25 May 2025, 10:20 AM" },
  { id: 5, brand: "Google", model: "Pixel 9 Pro", storage: "256GB", price: 1749, cost: 1229, stock: 0, sold: 19, updated: "25 May 2025, 09:15 AM" },
  { id: 6, brand: "Google", model: "Pixel 9", storage: "128GB", price: 1249, cost: 849, stock: 6, sold: 19, updated: "25 May 2025, 09:40 AM" },
  { id: 7, brand: "OnePlus", model: "OnePlus 13", storage: "256GB", price: 1199, cost: 559, stock: 7, sold: 10, updated: "25 May 2025, 09:50 AM" },
  { id: 8, brand: "Xiaomi", model: "Redmi Note 15 Pro", storage: "256GB", price: 899, cost: 499, stock: 12, sold: 8, updated: "25 May 2025, 09:35 AM" },
  { id: 9, brand: "Xiaomi", model: "Redmi Note 15", storage: "256GB", price: 599, cost: 299, stock: 14, sold: 6, updated: "25 May 2025, 09:30 AM" }
];

let revenueChart;
let unitsChart;
let salesChart;
let profitChart;

const money = value => "$" + Math.round(value).toLocaleString();

function productName(product) {
  return `${product.brand} ${product.model} ${product.storage}`;
}

function nowText() {
  return new Date().toLocaleString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function stockStatus(stock) {
  if (stock === 0) return { text: "Out of Stock", class: "out" };
  if (stock <= 5) return { text: "Low Stock", class: "low" };
  return { text: "In Stock", class: "in" };
}

function fillDropdown() {
  const select = document.getElementById("productSelect");

  select.innerHTML = products.map(product => {
    return `<option value="${product.id}">${productName(product)}</option>`;
  }).join("");

  select.value = 3;
}

function brandTotals(callback) {
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];

  return brands.map(brand => {
    return products
      .filter(product => product.brand === brand)
      .reduce((sum, product) => sum + callback(product), 0);
  });
}

function updateCards() {
  const unitsSold = products.reduce((sum, product) => sum + product.sold, 0);
  const revenue = products.reduce((sum, product) => sum + product.sold * product.price, 0);
  const avgSale = revenue / unitsSold;

  document.getElementById("unitsSold").textContent = unitsSold.toLocaleString();
  document.getElementById("averageSale").textContent = money(avgSale);
  document.getElementById("totalRevenue").textContent = money(revenue);
}

function updateTable() {
  const table = document.getElementById("inventoryTable");

  table.innerHTML = products.map(product => {
    const status = stockStatus(product.stock);

    return `
      <tr>
        <td>${product.brand}</td>
        <td>${product.model}</td>
        <td>${product.storage}</td>
        <td>${money(product.price)}</td>
        <td>${product.stock}</td>
        <td>${product.sold}</td>
        <td>${money(product.price * product.stock)}</td>
        <td><span class="badge ${status.class}">${status.text}</span></td>
        <td>${product.updated}</td>
      </tr>
    `;
  }).join("");
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: {
          color: "#10233f",
          font: { size: 10, weight: "bold" }
        },
        grid: { color: "#e2e8f0" }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#10233f",
          font: { size: 10, weight: "bold" }
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };
}

function createCharts() {
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];
  const colors = ["#2563eb", "#1e3a8a", "#64748b", "#334155", "#0f172a"];

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: brands,
      datasets: [{
        data: brandTotals(product => product.price * product.sold),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: chartOptions()
  });

  unitsChart = new Chart(document.getElementById("unitsChart"), {
    type: "bar",
    data: {
      labels: brands,
      datasets: [{
        data: brandTotals(product => product.sold),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: chartOptions()
  });

  salesChart = new Chart(document.getElementById("salesChart"), {
    type: "line",
    data: {
      labels: products.map(product => product.model),
      datasets: [{
        data: products.map(product => product.sold),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 3
      }]
    },
    options: chartOptions()
  });

  profitChart = new Chart(document.getElementById("profitChart"), {
    type: "bar",
    data: {
      labels: products.map(product => product.model),
      datasets: [{
        data: products.map(product => (product.price - product.cost) * product.sold),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: chartOptions()
  });
}

function updateCharts() {
  revenueChart.data.datasets[0].data = brandTotals(product => product.price * product.sold);
  unitsChart.data.datasets[0].data = brandTotals(product => product.sold);
  salesChart.data.datasets[0].data = products.map(product => product.sold);
  profitChart.data.datasets[0].data = products.map(product => (product.price - product.cost) * product.sold);

  revenueChart.update();
  unitsChart.update();
  salesChart.update();
  profitChart.update();
}

function showMessage(text, type = "success") {
  const box = document.getElementById("messageBox");
  box.textContent = text;
  box.className = `message ${type}`;
}

function applyUpdate() {
  const action = document.getElementById("actionSelect").value;
  const productId = Number(document.getElementById("productSelect").value);
  const quantity = Number(document.getElementById("quantityInput").value);
  const product = products.find(item => item.id === productId);

  if (!Number.isInteger(quantity) || quantity < 0) {
    showMessage("Enter a valid whole number.", "error");
    return;
  }

  if ((action === "add" || action === "remove") && quantity === 0) {
    showMessage("Quantity must be at least 1.", "error");
    return;
  }

  if (action === "remove" && quantity > product.stock) {
    showMessage("Cannot remove more stock than available.", "error");
    return;
  }

  const updated = nowText();

  if (action === "add") {
    product.stock += quantity;
    showMessage(`${quantity} unit(s) added to ${productName(product)}.`);
  }

  if (action === "remove") {
    product.stock -= quantity;
    product.sold += quantity;
    showMessage(`${quantity} unit(s) sold from ${productName(product)}.`);
  }

  if (action === "set") {
    product.stock = quantity;
    showMessage(`${productName(product)} stock set to ${quantity}.`);
  }

  product.updated = updated;
  document.getElementById("dateBox").textContent = updated;

  updateCards();
  updateTable();
  updateCharts();
}

fillDropdown();
updateCards();
updateTable();
createCharts();

document.getElementById("applyUpdate").addEventListener("click", applyUpdate);
