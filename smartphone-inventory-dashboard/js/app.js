const products = [
  {
    id: 1,
    brand: "Apple",
    model: "iPhone 16 Pro",
    storage: "256GB",
    price: 2199,
    cost: 1399,
    stock: 8,
    sold: 4,
    updated: "25 May 2025, 10:45 AM"
  },
  {
    id: 2,
    brand: "Apple",
    model: "iPhone 16",
    storage: "128GB",
    price: 1499,
    cost: 879,
    stock: 10,
    sold: 3,
    updated: "25 May 2025, 10:45 AM"
  },
  {
    id: 3,
    brand: "Samsung",
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    price: 2399,
    cost: 1599,
    stock: 7,
    sold: 4,
    updated: "25 May 2025, 10:45 AM"
  },
  {
    id: 4,
    brand: "Samsung",
    model: "Galaxy S25",
    storage: "256GB",
    price: 1899,
    cost: 1199,
    stock: 9,
    sold: 3,
    updated: "25 May 2025, 10:20 AM"
  },
  {
    id: 5,
    brand: "Google",
    model: "Pixel 9 Pro",
    storage: "256GB",
    price: 1749,
    cost: 1199,
    stock: 0,
    sold: 2,
    updated: "25 May 2025, 09:15 AM"
  },
  {
    id: 6,
    brand: "Google",
    model: "Pixel 9",
    storage: "128GB",
    price: 1249,
    cost: 849,
    stock: 5,
    sold: 2,
    updated: "25 May 2025, 09:40 AM"
  },
  {
    id: 7,
    brand: "OnePlus",
    model: "OnePlus 13",
    storage: "256GB",
    price: 1199,
    cost: 799,
    stock: 2,
    sold: 2,
    updated: "25 May 2025, 09:10 AM"
  },
  {
    id: 8,
    brand: "Xiaomi",
    model: "Redmi Note 15 Pro",
    storage: "256GB",
    price: 899,
    cost: 469,
    stock: 12,
    sold: 1,
    updated: "25 May 2025, 08:50 AM"
  }
];

const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantityInput");
const actionSelect = document.getElementById("actionSelect");
const messageBox = document.getElementById("messageBox");
const inventoryTable = document.getElementById("inventoryTable");

const unitsSoldEl = document.getElementById("unitsSold");
const inventoryValueEl = document.getElementById("inventoryValue");
const totalRevenueEl = document.getElementById("totalRevenue");

let revenueChart;
let unitsChart;
let salesShareChart;
let profitChart;

function populateProducts() {
  productSelect.innerHTML = "";

  products.forEach(product => {
    const option = document.createElement("option");

    option.value = product.id;

    option.textContent =
      `${product.brand} ${product.model} ${product.storage}`;

    productSelect.appendChild(option);
  });
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });
}

function getStatus(stock) {
  if (stock === 0) {
    return {
      text: "Out of Stock",
      className: "out"
    };
  }

  if (stock <= 5) {
    return {
      text: "Low Stock",
      className: "low"
    };
  }

  return {
    text: "In Stock",
    className: "in"
  };
}

function renderTable() {
  inventoryTable.innerHTML = "";

  products.forEach(product => {
    const revenue = product.price * product.sold;

    const status = getStatus(product.stock);

    const row = `
      <tr>
        <td>${product.brand}</td>
        <td>${product.model}</td>
        <td>${product.storage}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${product.stock}</td>
        <td>${product.sold}</td>
        <td>${formatCurrency(revenue)}</td>
        <td>
          <span class="badge ${status.className}">
            ${status.text}
          </span>
        </td>
        <td>${product.updated}</td>
      </tr>
    `;

    inventoryTable.innerHTML += row;
  });
}

function updateCards() {
  const unitsSold = products.reduce((sum, p) => sum + p.sold, 0);

  const inventoryValue = products.reduce((sum, p) => {
    return sum + (p.stock * p.price);
  }, 0);

  const totalRevenue = products.reduce((sum, p) => {
    return sum + (p.sold * p.price);
  }, 0);

  unitsSoldEl.textContent = unitsSold;

  inventoryValueEl.textContent =
    formatCurrency(inventoryValue);

  totalRevenueEl.textContent =
    formatCurrency(totalRevenue);
}

function destroyCharts() {
  if (revenueChart) revenueChart.destroy();
  if (unitsChart) unitsChart.destroy();
  if (salesShareChart) salesShareChart.destroy();
  if (profitChart) profitChart.destroy();
}

function renderCharts() {

  destroyCharts();

  const labels = products.map(p => p.model);

  const revenueData = products.map(p => p.price * p.sold);

  const unitsData = products.map(p => p.sold);

  const brandTotals = {};

  products.forEach(product => {
    const revenue = product.price * product.sold;

    if (!brandTotals[product.brand]) {
      brandTotals[product.brand] = 0;
    }

    brandTotals[product.brand] += revenue;
  });

  const brandLabels = Object.keys(brandTotals);

  const brandData = Object.values(brandTotals);

  const profitability = [...products]
    .map(product => ({
      name: product.model,
      profit: (product.price - product.cost) * product.sold
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 3);

  const colors = [
    "#3267e3",
    "#2a4597",
    "#6d7f99",
    "#3d4b63",
    "#091736",
    "#437de5",
    "#55657e",
    "#2aa4e0"
  ];

  revenueChart = new Chart(
    document.getElementById("revenueChart"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data: revenueData,
          backgroundColor: colors,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  );

  unitsChart = new Chart(
    document.getElementById("unitsChart"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data: unitsData,
          backgroundColor: colors,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  );

  salesShareChart = new Chart(
    document.getElementById("salesShareChart"),
    {
      type: "doughnut",
      data: {
        labels: brandLabels,
        datasets: [{
          data: brandData,
          backgroundColor: [
            "#3267e3",
            "#2a4597",
            "#6d7f99",
            "#3d4b63",
            "#091736"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          }
        }
      }
    }
  );

  profitChart = new Chart(
    document.getElementById("profitChart"),
    {
      type: "bar",
      data: {
        labels: profitability.map(p => p.name),
        datasets: [{
          data: profitability.map(p => p.profit),
          backgroundColor: [
            "#3267e3",
            "#2a4597",
            "#6d7f99"
          ],
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.7
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    }
  );
}

function updateRestockAlerts() {

  const restockList =
    document.getElementById("restockList");

  restockList.innerHTML = "";

  const alerts = products.filter(product => product.stock <= 5);

  alerts.forEach(product => {

    const status =
      product.stock === 0
        ? "Out of Stock"
        : "Low Stock";

    const className =
      product.stock === 0
        ? "alert-out"
        : "alert-low";

    const item = document.createElement("div");

    item.className = "alert-item";

    item.innerHTML = `
      <span class="alert-name">
        ${product.model}
      </span>

      <span class="alert-badge ${className}">
        ${status}
      </span>
    `;

    restockList.appendChild(item);
  });
}

function updateDashboard() {
  renderTable();
  updateCards();
  renderCharts();
  updateRestockAlerts();
}

document
  .getElementById("applyUpdate")
  .addEventListener("click", () => {

    const productId =
      Number(productSelect.value);

    const quantity =
      Number(quantityInput.value);

    const action =
      actionSelect.value;

    const product =
      products.find(p => p.id === productId);

    if (!product || quantity < 0) {
      return;
    }

    if (action === "add") {
      product.stock += quantity;
    }

    if (action === "remove") {

      if (product.stock >= quantity) {
        product.stock -= quantity;
        product.sold += quantity;
      } else {

        messageBox.className =
          "message error";

        messageBox.textContent =
          "Not enough stock available.";

        return;
      }
    }

    if (action === "set") {
      product.stock = quantity;
    }

    product.updated =
      "25 May 2025, 10:45 AM";

    messageBox.className =
      "message success";

    messageBox.textContent =
      `${product.model} updated successfully.`;

    updateDashboard();
  });

populateProducts();
updateDashboard();
