const products = [
  { id: 1, brand: "Apple", model: "iPhone 16 Pro", storage: "256GB", price: 2199, cost: 1399, stock: 10, sold: 36, lastUpdated: "25 May 2025, 10:45 AM" },
  { id: 2, brand: "Apple", model: "iPhone 16", storage: "128GB", price: 1499, cost: 929, stock: 13, sold: 32, lastUpdated: "25 May 2025, 10:45 AM" },
  { id: 3, brand: "Samsung", model: "Galaxy S25 Ultra", storage: "256GB", price: 2399, cost: 1779, stock: 5, sold: 35, lastUpdated: "25 May 2025, 10:45 AM" },
  { id: 4, brand: "Samsung", model: "Galaxy S25", storage: "256GB", price: 1899, cost: 1399, stock: 8, sold: 29, lastUpdated: "25 May 2025, 10:20 AM" },
  { id: 5, brand: "Google", model: "Pixel 9 Pro", storage: "256GB", price: 1749, cost: 1229, stock: 0, sold: 19, lastUpdated: "25 May 2025, 09:15 AM" },
  { id: 6, brand: "Google", model: "Pixel 9", storage: "128GB", price: 1249, cost: 849, stock: 6, sold: 19, lastUpdated: "25 May 2025, 09:40 AM" },
  { id: 7, brand: "OnePlus", model: "OnePlus 13", storage: "256GB", price: 1199, cost: 559, stock: 7, sold: 10, lastUpdated: "25 May 2025, 09:50 AM" },
  { id: 8, brand: "Xiaomi", model: "Redmi Note 15 Pro", storage: "256GB", price: 899, cost: 499, stock: 12, sold: 8, lastUpdated: "25 May 2025, 09:35 AM" },
  { id: 9, brand: "Xiaomi", model: "Redmi Note 15", storage: "256GB", price: 599, cost: 299, stock: 14, sold: 6, lastUpdated: "25 May 2025, 09:30 AM" }
];

const formatter = new Intl.NumberFormat("en-US");
const money = value => `$${formatter.format(Math.round(value))}`;

const brandStyles = {
  Apple: { icon: "<i class='fa-brands fa-apple'></i>", className: "apple" },
  Samsung: { icon: "●", className: "samsung" },
  Google: { icon: "G", className: "google" },
  OnePlus: { icon: "1+", className: "oneplus" },
  Xiaomi: { icon: "Mi", className: "xiaomi" }
};

const chartColours = ["#2563eb", "#1e3a8a", "#64748b", "#334155", "#0f172a"];
let revenueBrandChart;
let unitsBrandChart;
let salesLineChart;
let profitChart;

function getNowLabel() {
  const now = new Date();
  return now.toLocaleString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).replace(",", "");
}

function getStatus(stock) {
  if (stock === 0) return { text: "Out of Stock", className: "out" };
  if (stock <= 5) return { text: "Low Stock", className: "low" };
  return { text: "In Stock", className: "in" };
}

function productLabel(product) {
  return `${product.brand} ${product.model} ${product.storage}`;
}

function populateProductDropdown() {
  const select = document.getElementById("productSelect");
  select.innerHTML = products.map(product => `
    <option value="${product.id}">${productLabel(product)}</option>
  `).join("");
  select.value = "3";
}

function groupByBrand(metric) {
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];
  return brands.map(brand => {
    return products
      .filter(product => product.brand === brand)
      .reduce((total, product) => total + metric(product), 0);
  });
}

function updateKpis() {
  const totalSold = products.reduce((sum, product) => sum + product.sold, 0);
  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sold), 0);
  const averageSale = totalSold === 0 ? 0 : totalRevenue / totalSold;

  document.getElementById("unitsSoldKpi").textContent = formatter.format(totalSold);
  document.getElementById("avgSaleKpi").textContent = money(averageSale);
  document.getElementById("revenueKpi").textContent = money(totalRevenue);
}

function updateTable() {
  const body = document.getElementById("inventoryBody");
  body.innerHTML = products.map(product => {
    const status = getStatus(product.stock);
    const brandStyle = brandStyles[product.brand];

    return `
      <tr>
        <td>
          <div class="brand-cell">
            <span class="brand-logo ${brandStyle.className}">${brandStyle.icon}</span>
            ${product.brand}
          </div>
        </td>
        <td>${product.model}</td>
        <td>${product.storage}</td>
        <td>${money(product.price)}</td>
        <td>${product.stock}</td>
        <td>${product.sold}</td>
        <td>${money(product.price * product.stock)}</td>
        <td><span class="status ${status.className}">${status.text}</span></td>
        <td>${product.lastUpdated}</td>
      </tr>
    `;
  }).join("");
}

function baseChartOptions(horizontal = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#10233f", font: { weight: "700" } }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e2e8f0" },
        ticks: { color: "#10233f", font: { weight: "700" } }
      }
    }
  };
}

function createCharts() {
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"];

  revenueBrandChart = new Chart(document.getElementById("revenueBrandChart"), {
    type: "bar",
    data: {
      labels: brands,
      datasets: [{
        data: groupByBrand(product => product.price * product.sold),
        backgroundColor: chartColours,
        borderRadius: 4
      }]
    },
    options: {
      ...baseChartOptions(),
      scales: {
        x: baseChartOptions().scales.x,
        y: {
          ...baseChartOptions().scales.y,
          ticks: {
            callback: value => `$${value / 1000}K`,
            color: "#10233f",
            font: { weight: "700" }
          }
        }
      },
      plugins: {
        ...baseChartOptions().plugins,
        tooltip: { callbacks: { label: context => money(context.raw) } }
      }
    }
  });

  unitsBrandChart = new Chart(document.getElementById("unitsBrandChart"), {
    type: "bar",
    data: {
      labels: brands,
      datasets: [{
        data: groupByBrand(product => product.sold),
        backgroundColor: chartColours,
        borderRadius: 4
      }]
    },
    options: baseChartOptions()
  });

  salesLineChart = new Chart(document.getElementById("salesLineChart"), {
    type: "line",
    data: {
      labels: ["Apr 26", "May 1", "May 6", "May 11", "May 16", "May 21", "May 25"],
      datasets: [{
        data: [2100, 3850, 4950, 2500, 4050, 2900, 5250],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.14)",
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#2563eb"
      }]
    },
    options: {
      ...baseChartOptions(),
      scales: {
        x: baseChartOptions().scales.x,
        y: {
          ...baseChartOptions().scales.y,
          ticks: {
            callback: value => value >= 1000 ? `${value / 1000}K` : value,
            color: "#10233f",
            font: { weight: "700" }
          }
        }
      }
    }
  });

  profitChart = new Chart(document.getElementById("profitChart"), {
    type: "bar",
    data: {
      labels: products.map(product => productLabel(product)),
      datasets: [{
        data: products.map(product => (product.price - product.cost) * product.sold),
        backgroundColor: products.map((_, index) => chartColours[index % chartColours.length]),
        borderRadius: 4
      }]
    },
    options: {
      ...baseChartOptions(true),
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "#e2e8f0" },
          ticks: {
            callback: value => `$${value / 1000}K`,
            color: "#10233f",
            font: { weight: "700" }
          }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#10233f", font: { weight: "700" } }
        }
      },
      plugins: {
        ...baseChartOptions(true).plugins,
        tooltip: { callbacks: { label: context => `Profit: ${money(context.raw)}` } }
      }
    }
  });
}

function updateCharts() {
  revenueBrandChart.data.datasets[0].data = groupByBrand(product => product.price * product.sold);
  unitsBrandChart.data.datasets[0].data = groupByBrand(product => product.sold);
  profitChart.data.labels = products.map(product => productLabel(product));
  profitChart.data.datasets[0].data = products.map(product => (product.price - product.cost) * product.sold);

  const totalRevenue = products.reduce((sum, product) => sum + product.price * product.sold, 0);
  const lastPoint = Math.round(totalRevenue / 45);
  salesLineChart.data.datasets[0].data = [2100, 3850, 4950, 2500, 4050, 2900, lastPoint];

  revenueBrandChart.update();
  unitsBrandChart.update();
  salesLineChart.update();
  profitChart.update();
}

function showMessage(type, title, body) {
  const systemMessage = document.getElementById("systemMessage");
  const messageIcon = document.getElementById("messageIcon");
  const messageText = document.getElementById("messageText");

  systemMessage.classList.toggle("error", type === "error");
  messageIcon.innerHTML = type === "error"
    ? "<i class='fa-solid fa-xmark'></i>"
    : "<i class='fa-solid fa-check'></i>";
  messageText.innerHTML = `<strong>${title}</strong>${body}`;
}

function applyUpdate() {
  const action = document.getElementById("actionSelect").value;
  const productId = Number(document.getElementById("productSelect").value);
  const quantity = Number(document.getElementById("quantityInput").value);
  const product = products.find(item => item.id === productId);

  if (!Number.isInteger(quantity) || quantity < 0) {
    showMessage("error", "Invalid quantity.", "Enter a whole number of 0 or higher.");
    return;
  }

  if ((action === "add" || action === "remove") && quantity === 0) {
    showMessage("error", "Invalid quantity.", "Add or remove quantity must be at least 1.");
    return;
  }

  if (action === "remove" && quantity > product.stock) {
    showMessage("error", "Not enough stock available.", `${productLabel(product)} only has ${product.stock} unit(s) in stock.`);
    return;
  }

  const nowLabel = getNowLabel();

  if (action === "add") {
    product.stock += quantity;
    product.lastUpdated = nowLabel;
    showMessage("success", "Inventory updated successfully!", `${quantity} × ${productLabel(product)} added to stock.<br><br>${nowLabel}`);
  }

  if (action === "remove") {
    product.stock -= quantity;
    product.sold += quantity;
    product.lastUpdated = nowLabel;
    showMessage("success", "Inventory updated successfully!", `${quantity} × ${productLabel(product)} sold.<br><br>${nowLabel}`);
  }

  if (action === "set") {
    product.stock = quantity;
    product.lastUpdated = nowLabel;
    showMessage("success", "Stock level updated successfully!", `${productLabel(product)} stock set to ${quantity}.<br><br>${nowLabel}`);
  }

  document.getElementById("lastUpdatedBox").textContent = nowLabel;
  document.getElementById("topDate").textContent = nowLabel;

  updateKpis();
  updateTable();
  updateCharts();
}

function initDashboard() {
  populateProductDropdown();
  updateKpis();
  updateTable();
  createCharts();
  document.getElementById("applyUpdate").addEventListener("click", applyUpdate);
}

initDashboard();
