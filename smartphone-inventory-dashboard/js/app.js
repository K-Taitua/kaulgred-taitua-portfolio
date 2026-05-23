// ========================================
// SMARTPHONE INVENTORY DASHBOARD DATA
// ========================================

const products = [
  { brand: "Apple", model: "iPhone 16 Pro", storage: "256GB", price: 2199, stock: 10, sold: 36 },
  { brand: "Apple", model: "iPhone 16", storage: "128GB", price: 1599, stock: 18, sold: 28 },
  { brand: "Samsung", model: "Galaxy S25 Ultra", storage: "256GB", price: 2399, stock: 5, sold: 35 },
  { brand: "Samsung", model: "Galaxy S25", storage: "256GB", price: 1599, stock: 14, sold: 25 },
  { brand: "Google", model: "Pixel 9 Pro", storage: "256GB", price: 1749, stock: 7, sold: 19 },
  { brand: "Google", model: "Pixel 9", storage: "128GB", price: 1289, stock: 11, sold: 16 },
  { brand: "OnePlus", model: "OnePlus 13", storage: "256GB", price: 1284, stock: 6, sold: 14 },
  { brand: "Xiaomi", model: "Redmi Note 15 Pro", storage: "256GB", price: 696, stock: 22, sold: 11 },
  { brand: "Xiaomi", model: "Redmi Note 15", storage: "256GB", price: 596, stock: 25, sold: 8 }
];

let revenueChart;
let unitsChart;
let salesTrendChart;
let stockChart;

// ========================================
// FORMAT MONEY
// ========================================

function formatMoney(value) {
  return "$" + value.toLocaleString("en-NZ");
}

// ========================================
// STOCK STATUS
// ========================================

function getStatus(stock) {
  if (stock === 0) return { text: "Out of Stock", className: "out-stock" };
  if (stock <= 5) return { text: "Low Stock", className: "low-stock" };
  return { text: "In Stock", className: "in-stock" };
}

// ========================================
// DASHBOARD TOTALS
// ========================================

function updateSummaryCards() {
  const totalRevenue = products.reduce((sum, product) => {
    return sum + product.price * product.sold;
  }, 0);

  const unitsSold = products.reduce((sum, product) => {
    return sum + product.sold;
  }, 0);

  const averagePrice = products.reduce((sum, product) => {
    return sum + product.price;
  }, 0) / products.length;

  document.querySelector(".summary-card:nth-child(1) p").textContent = formatMoney(totalRevenue);
  document.querySelector(".summary-card:nth-child(2) p").textContent = unitsSold;
  document.querySelector(".summary-card:nth-child(3) p").textContent = formatMoney(Math.round(averagePrice));
}

// ========================================
// INVENTORY TABLE
// ========================================

function renderTable() {
  const tableBody = document.getElementById("inventoryTableBody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const status = getStatus(product.stock);
    const inventoryValue = product.price * product.stock;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.brand}</td>
      <td>${product.model}</td>
      <td>${product.storage}</td>
      <td>${formatMoney(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.sold}</td>
      <td>${formatMoney(inventoryValue)}</td>
      <td><span class="status ${status.className}">${status.text}</span></td>
    `;

    tableBody.appendChild(row);
  });
}

// ========================================
// CHART DATA
// ========================================

function productLabels() {
  return products.map(product => product.model);
}

function productRevenue() {
  return products.map(product => product.price * product.sold);
}

function productUnitsSold() {
  return products.map(product => product.sold);
}

function productStock() {
  return products.map(product => product.stock);
}

// ========================================
// CHART SETTINGS
// ========================================

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#334155",
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        color: "#334155",
        font: {
          size: 11
        }
      },
      grid: {
        color: "#e5e7eb"
      }
    }
  }
};

// ========================================
// CREATE CHARTS
// ========================================

function createCharts() {
  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: productLabels(),
      datasets: [{
        data: productRevenue(),
        backgroundColor: "#2563eb",
        borderRadius: 6
      }]
    },
    options: chartOptions
  });

  unitsChart = new Chart(document.getElementById("unitsChart"), {
    type: "bar",
    data: {
      labels: productLabels(),
      datasets: [{
        data: productUnitsSold(),
        backgroundColor: "#1e3a8a",
        borderRadius: 6
      }]
    },
    options: chartOptions
  });

  salesTrendChart = new Chart(document.getElementById("salesTrendChart"), {
    type: "line",
    data: {
      labels: ["Apr 26", "May 1", "May 6", "May 11", "May 16", "May 21", "May 25"],
      datasets: [{
        data: [18000, 36000, 31000, 42000, 39000, 29000, 51000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#2563eb"
      }]
    },
    options: chartOptions
  });

  stockChart = new Chart(document.getElementById("stockChart"), {
    type: "bar",
    data: {
      labels: productLabels(),
      datasets: [{
        data: productStock(),
        backgroundColor: "#475569",
        borderRadius: 6
      }]
    },
    options: {
      ...chartOptions,
      indexAxis: "y"
    }
  });
}

// ========================================
// UPDATE CHARTS
// ========================================

function updateCharts() {
  revenueChart.data.datasets[0].data = productRevenue();
  unitsChart.data.datasets[0].data = productUnitsSold();
  stockChart.data.datasets[0].data = productStock();

  revenueChart.update();
  unitsChart.update();
  stockChart.update();
}

// ========================================
// UPDATE PRODUCT DROPDOWN
// ========================================

function updateProductDropdown() {
  const brandSelect = document.getElementById("brandSelect");
  const productSelect = document.getElementById("productSelect");

  const selectedBrand = brandSelect.value;
  const matchingProducts = products.filter(product => product.brand === selectedBrand);

  productSelect.innerHTML = "";

  matchingProducts.forEach(product => {
    const option = document.createElement("option");
    option.value = product.model;
    option.textContent = product.model;
    productSelect.appendChild(option);
  });
}

// ========================================
// INVENTORY ACTIONS
// ========================================

function updateInventory() {
  const action = document.getElementById("actionSelect").value;
  const brand = document.getElementById("brandSelect").value;
  const model = document.getElementById("productSelect").value;
  const quantityInput = document.querySelector("input[type='number']");
  const quantity = Number(quantityInput.value);
  const messageBox = document.querySelector(".system-message");

  const product = products.find(item => item.brand === brand && item.model === model);

  if (!product) {
    messageBox.textContent = "Product not found.";
    return;
  }

  if (quantity <= 0) {
    messageBox.textContent = "Quantity must be greater than 0.";
    return;
  }

  if (action === "Record Sale") {
    if (quantity > product.stock) {
      messageBox.textContent = "Not enough stock available.";
      return;
    }

    product.stock -= quantity;
    product.sold += quantity;

    messageBox.textContent = `${quantity} x ${product.model} sold. Inventory updated.`;
  }

  if (action === "Restock Product") {
    product.stock += quantity;

    messageBox.textContent = `${quantity} x ${product.model} added to stock.`;
  }

  if (action === "Adjust Stock") {
    product.stock = quantity;

    messageBox.textContent = `${product.model} stock adjusted to ${quantity}.`;
  }

  updateSummaryCards();
  renderTable();
  updateCharts();
}

// ========================================
// INITIAL LOAD
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  updateProductDropdown();
  updateSummaryCards();
  renderTable();
  createCharts();

  document.getElementById("brandSelect").addEventListener("change", updateProductDropdown);
  document.querySelector(".update-btn").addEventListener("click", updateInventory);
});
