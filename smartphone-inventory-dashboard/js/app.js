// =========================================================
// SMARTPHONE INVENTORY MANAGEMENT DASHBOARD
// JavaScript file for product data, dashboard totals,
// inventory table rendering, chart creation, and actions.
// =========================================================


// =========================================================
// PRODUCT DATA
// This matches the Python/SQLite database demo data.
// Each product has price, stock, units sold, and update time.
// =========================================================

const products = [
  {
    brand: "Apple",
    model: "iPhone 16 Pro",
    storage: "256GB",
    price: 2199,
    stock: 10,
    sold: 36,
    lastUpdated: "25 May 2025, 10:45 AM"
  },
  {
    brand: "Apple",
    model: "iPhone 16",
    storage: "128GB",
    price: 1599,
    stock: 18,
    sold: 28,
    lastUpdated: "25 May 2025, 10:30 AM"
  },
  {
    brand: "Samsung",
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    price: 2399,
    stock: 5,
    sold: 35,
    lastUpdated: "25 May 2025, 10:30 AM"
  },
  {
    brand: "Samsung",
    model: "Galaxy S25",
    storage: "256GB",
    price: 1599,
    stock: 14,
    sold: 25,
    lastUpdated: "25 May 2025, 10:28 AM"
  },
  {
    brand: "Google",
    model: "Pixel 9 Pro",
    storage: "256GB",
    price: 1749,
    stock: 7,
    sold: 19,
    lastUpdated: "25 May 2025, 09:15 AM"
  },
  {
    brand: "Google",
    model: "Pixel 9",
    storage: "128GB",
    price: 1289,
    stock: 11,
    sold: 16,
    lastUpdated: "25 May 2025, 09:10 AM"
  },
  {
    brand: "OnePlus",
    model: "OnePlus 13",
    storage: "256GB",
    price: 1284,
    stock: 6,
    sold: 14,
    lastUpdated: "25 May 2025, 09:10 AM"
  },
  {
    brand: "Xiaomi",
    model: "Redmi Note 15 Pro",
    storage: "256GB",
    price: 696,
    stock: 22,
    sold: 11,
    lastUpdated: "25 May 2025, 08:50 AM"
  },
  {
    brand: "Xiaomi",
    model: "Redmi Note 15",
    storage: "256GB",
    price: 596,
    stock: 25,
    sold: 8,
    lastUpdated: "25 May 2025, 08:50 AM"
  }
];


// =========================================================
// GLOBAL CHART VARIABLES
// These let us update charts after inventory changes.
// =========================================================

let revenueChart;
let unitsChart;
let salesTrendChart;
let stockChart;


// =========================================================
// FORMAT MONEY
// Converts numbers into NZD-style currency.
// Example: 2199 becomes $2,199
// =========================================================

function formatMoney(value) {
  return "$" + Math.round(value).toLocaleString("en-NZ");
}


// =========================================================
// CURRENT DATE/TIME DISPLAY
// Used when the inventory is updated from the sidebar.
// =========================================================

function getCurrentDateTime() {
  const now = new Date();

  return now.toLocaleString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}


// =========================================================
// STOCK STATUS LOGIC
// This matches the Python dashboard_report.py logic.
// 0 stock = Out of Stock
// 1 to 5 stock = Low Stock
// 6+ stock = In Stock
// =========================================================

function getStatus(stock) {
  if (stock === 0) {
    return {
      text: "Out of Stock",
      className: "out-stock"
    };
  }

  if (stock <= 5) {
    return {
      text: "Low Stock",
      className: "low-stock"
    };
  }

  return {
    text: "In Stock",
    className: "in-stock"
  };
}


// =========================================================
// GROUP DATA BY BRAND
// This creates grouped totals for brand charts.
// Example: Apple total revenue, Samsung total stock, etc.
// =========================================================

function groupByBrand(type) {
  const brandTotals = {};

  products.forEach((product) => {
    if (!brandTotals[product.brand]) {
      brandTotals[product.brand] = 0;
    }

    if (type === "revenue") {
      brandTotals[product.brand] += product.price * product.sold;
    }

    if (type === "sold") {
      brandTotals[product.brand] += product.sold;
    }

    if (type === "stock") {
      brandTotals[product.brand] += product.stock;
    }
  });

  return brandTotals;
}


// =========================================================
// UPDATE SUMMARY CARDS
// Updates the top cards:
// Total Revenue, Units Sold, Average Product Price.
// =========================================================

function updateSummaryCards() {
  const totalRevenue = products.reduce((sum, product) => {
    return sum + product.price * product.sold;
  }, 0);

  const totalUnitsSold = products.reduce((sum, product) => {
    return sum + product.sold;
  }, 0);

  const averageProductPrice =
    products.reduce((sum, product) => {
      return sum + product.price;
    }, 0) / products.length;

  document.getElementById("totalRevenue").textContent =
    formatMoney(totalRevenue);

  document.getElementById("unitsSold").textContent =
    totalUnitsSold;

  document.getElementById("averagePrice").textContent =
    formatMoney(averageProductPrice);
}


// =========================================================
// RENDER INVENTORY TABLE
// Adds all products into the table.
// Inventory Value = Price x Current Stock.
// =========================================================

function renderInventoryTable() {
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
      <td>${product.lastUpdated}</td>
    `;

    tableBody.appendChild(row);
  });
}


// =========================================================
// UPDATE DROPDOWN OPTIONS
// Brand dropdown controls which models are shown.
// Storage updates based on selected model.
// =========================================================

function populateBrandDropdown() {
  const brandSelect = document.getElementById("brandSelect");
  const brands = [...new Set(products.map(product => product.brand))];

  brandSelect.innerHTML = "";

  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}


function populateProductDropdown() {
  const brandSelect = document.getElementById("brandSelect");
  const productSelect = document.getElementById("productSelect");

  const selectedBrand = brandSelect.value;

  const matchingProducts = products.filter((product) => {
    return product.brand === selectedBrand;
  });

  productSelect.innerHTML = "";

  matchingProducts.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.model;
    option.textContent = product.model;
    productSelect.appendChild(option);
  });

  populateStorageDropdown();
}


function populateStorageDropdown() {
  const brandSelect = document.getElementById("brandSelect");
  const productSelect = document.getElementById("productSelect");
  const storageSelect = document.getElementById("storageSelect");

  const selectedBrand = brandSelect.value;
  const selectedModel = productSelect.value;

  const selectedProduct = products.find((product) => {
    return product.brand === selectedBrand && product.model === selectedModel;
  });

  storageSelect.innerHTML = "";

  if (selectedProduct) {
    const option = document.createElement("option");
    option.value = selectedProduct.storage;
    option.textContent = selectedProduct.storage;
    storageSelect.appendChild(option);
  }
}


// =========================================================
// CHART CONFIGURATION
// Shared settings for all dashboard charts.
// =========================================================

const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false
    }
  },

  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: "#334155",
        font: {
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: "#e5e7eb"
      },
      ticks: {
        color: "#334155",
        font: {
          size: 11
        }
      }
    }
  }
};


// =========================================================
// CREATE CHARTS
// Creates the four dashboard graphs:
// Revenue by Brand, Units Sold by Brand,
// Sales Trend, Stock Levels by Brand.
// =========================================================

function createCharts() {
  const revenueByBrand = groupByBrand("revenue");
  const unitsSoldByBrand = groupByBrand("sold");
  const stockByBrand = groupByBrand("stock");

  const brandLabels = Object.keys(revenueByBrand);

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: brandLabels,
      datasets: [
        {
          data: Object.values(revenueByBrand),
          backgroundColor: [
            "#2563eb",
            "#1e3a8a",
            "#64748b",
            "#334155",
            "#475569"
          ],
          borderRadius: 5
        }
      ]
    },
    options: commonChartOptions
  });

  unitsChart = new Chart(document.getElementById("unitsChart"), {
    type: "bar",
    data: {
      labels: brandLabels,
      datasets: [
        {
          data: Object.values(unitsSoldByBrand),
          backgroundColor: [
            "#2563eb",
            "#1e3a8a",
            "#64748b",
            "#334155",
            "#475569"
          ],
          borderRadius: 5
        }
      ]
    },
    options: commonChartOptions
  });

  salesTrendChart = new Chart(document.getElementById("salesTrendChart"), {
    type: "line",
    data: {
      labels: [
        "Apr 26",
        "May 1",
        "May 6",
        "May 11",
        "May 16",
        "May 21",
        "May 25"
      ],
      datasets: [
        {
          data: [
            1800,
            3600,
            5100,
            2400,
            3900,
            2900,
            5200
          ],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#2563eb"
        }
      ]
    },
    options: commonChartOptions
  });

  stockChart = new Chart(document.getElementById("stockChart"), {
    type: "bar",
    data: {
      labels: Object.keys(stockByBrand),
      datasets: [
        {
          data: Object.values(stockByBrand),
          backgroundColor: [
            "#2563eb",
            "#1e3a8a",
            "#64748b",
            "#334155",
            "#475569"
          ],
          borderRadius: 5
        }
      ]
    },
    options: {
      ...commonChartOptions,
      indexAxis: "y"
    }
  });
}


// =========================================================
// UPDATE CHARTS
// Refreshes chart data after sale/restock/adjustment.
// =========================================================

function updateCharts() {
  const revenueByBrand = groupByBrand("revenue");
  const unitsSoldByBrand = groupByBrand("sold");
  const stockByBrand = groupByBrand("stock");

  revenueChart.data.datasets[0].data = Object.values(revenueByBrand);
  unitsChart.data.datasets[0].data = Object.values(unitsSoldByBrand);
  stockChart.data.datasets[0].data = Object.values(stockByBrand);

  revenueChart.update();
  unitsChart.update();
  stockChart.update();
}


// =========================================================
// UPDATE INVENTORY ACTION
// Handles Record Sale, Restock Product, and Adjust Stock.
// This mirrors the Python inventory_actions.py logic.
// =========================================================

function updateInventory() {
  const actionSelect = document.getElementById("actionSelect");
  const brandSelect = document.getElementById("brandSelect");
  const productSelect = document.getElementById("productSelect");
  const quantityInput = document.getElementById("quantityInput");
  const messageBox = document.getElementById("systemMessage");
  const lastUpdatedBox = document.getElementById("lastUpdated");

  const action = actionSelect.value;
  const selectedBrand = brandSelect.value;
  const selectedModel = productSelect.value;
  const quantity = Number(quantityInput.value);

  const product = products.find((item) => {
    return item.brand === selectedBrand && item.model === selectedModel;
  });

  if (!product) {
    messageBox.className = "system-message";
    messageBox.textContent = "Product not found.";
    return;
  }

  if (quantity <= 0) {
    messageBox.className = "system-message";
    messageBox.textContent = "Quantity must be greater than 0.";
    return;
  }

  const currentDateTime = getCurrentDateTime();

  if (action === "Record Sale") {
    if (quantity > product.stock) {
      messageBox.className = "system-message";
      messageBox.textContent = "Not enough stock available.";
      return;
    }

    product.stock -= quantity;
    product.sold += quantity;
    product.lastUpdated = currentDateTime;

    messageBox.className = "system-message success";
    messageBox.innerHTML = `
      ✅ Inventory updated successfully.<br>
      ${quantity} x ${product.model} sold.<br>
      ${currentDateTime}
    `;
  }

  if (action === "Restock Product") {
    product.stock += quantity;
    product.lastUpdated = currentDateTime;

    messageBox.className = "system-message success";
    messageBox.innerHTML = `
      ✅ Product restocked successfully.<br>
      ${quantity} x ${product.model} added.<br>
      ${currentDateTime}
    `;
  }

  if (action === "Adjust Stock") {
    product.stock = quantity;
    product.lastUpdated = currentDateTime;

    messageBox.className = "system-message success";
    messageBox.innerHTML = `
      ✅ Stock adjusted successfully.<br>
      ${product.model} stock set to ${quantity}.<br>
      ${currentDateTime}
    `;
  }

  lastUpdatedBox.textContent = currentDateTime;

  updateSummaryCards();
  renderInventoryTable();
  updateCharts();
}


// =========================================================
// INITIAL PAGE LOAD
// Runs when the dashboard first opens.
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  populateBrandDropdown();
  populateProductDropdown();

  updateSummaryCards();
  renderInventoryTable();
  createCharts();

  document
    .getElementById("brandSelect")
    .addEventListener("change", populateProductDropdown);

  document
    .getElementById("productSelect")
    .addEventListener("change", populateStorageDropdown);

  document
    .getElementById("updateBtn")
    .addEventListener("click", updateInventory);
});
