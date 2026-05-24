const products = [
  { id: 1, brand: "Apple", model: "iPhone 16 Pro", storage: "256GB", price: 2199, cost: 1399, stock: 8, sold: 7, updated: "25 May 2025, 10:45 AM" },
  { id: 2, brand: "Apple", model: "iPhone 16", storage: "128GB", price: 1499, cost: 929, stock: 10, sold: 6, updated: "25 May 2025, 10:45 AM" },
  { id: 3, brand: "Samsung", model: "Galaxy S25 Ultra", storage: "256GB", price: 2399, cost: 1779, stock: 7, sold: 6, updated: "25 May 2025, 10:45 AM" },
  { id: 4, brand: "Samsung", model: "Galaxy S25", storage: "256GB", price: 1899, cost: 1399, stock: 9, sold: 5, updated: "25 May 2025, 10:20 AM" },
  { id: 5, brand: "Google", model: "Pixel 9 Pro", storage: "256GB", price: 1749, cost: 1229, stock: 4, sold: 4, updated: "25 May 2025, 09:15 AM" },
  { id: 6, brand: "Google", model: "Pixel 9", storage: "128GB", price: 1249, cost: 849, stock: 8, sold: 4, updated: "25 May 2025, 09:40 AM" },
  { id: 7, brand: "OnePlus", model: "OnePlus 13", storage: "256GB", price: 1199, cost: 559, stock: 7, sold: 3, updated: "25 May 2025, 09:50 AM" },
  { id: 8, brand: "Xiaomi", model: "Redmi Note 15 Pro", storage: "256GB", price: 899, cost: 499, stock: 9, sold: 3, updated: "25 May 2025, 09:35 AM" },
  { id: 9, brand: "Xiaomi", model: "Redmi Note 15", storage: "256GB", price: 599, cost: 299, stock: 11, sold: 2, updated: "25 May 2025, 09:30 AM" }
];

let revenueChart;
let unitsChart;
let salesShareChart;
let profitChart;

const money = value => "$" + Math.round(value).toLocaleString();

function productName(product) {
  return `${product.brand} ${product.model} ${product.storage}`;
}

function shortName(product) {
  return product.model;
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

function getTopProfitProducts() {
  return [...products]
    .sort((a, b) => ((b.price - b.cost) * b.sold) - ((a.price - a.cost) * a.sold))
    .slice(0, 3);
}

function fillDropdown() {
  const select = document.getElementById("productSelect");

  select.innerHTML = products.map(product => {
    return `<option value="${product.id}">${productName(product)}</option>`;
  }).join("");

  select.value = "3";
}

function updateCards() {
  const unitsSold = products.reduce((sum, product) => sum + product.sold, 0);
  const inventoryValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);
  const revenue = products.reduce((sum, product) => sum + product.sold * product.price, 0);

  document.getElementById("unitsSold").textContent = unitsSold.toLocaleString();
  document.getElementById("inventoryValue").textContent = money(inventoryValue);
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
        <td>${money(product.price * product.sold)}</td>
        <td><span class="badge ${status.class}">${status.text}</span></td>
        <td>${product.updated}</td>
      </tr>
    `;
  }).join("");
}

const valueLabelPlugin = {
  id: "valueLabelPlugin",
  afterDatasetsDraw(chart) {
    if (chart.config.type === "doughnut") return;

    const { ctx } = chart;
    ctx.save();
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#10233f";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];
        const formatted = chart.config.options.indexAxis === "y"
          ? money(value)
          : value >= 1000
            ? money(value)
            : value.toLocaleString();

        if (chart.config.options.indexAxis === "y") {
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(formatted, bar.x + 6, bar.y);
        } else {
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(formatted, bar.x, bar.y - 5);
        }
      });
    });

    ctx.restore();
  }
};

Chart.register(valueLabelPlugin);

function productChartOptions(maxValue = null) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20, right: 22, bottom: 28, left: 8 }
    },
    plugins: {
      legend: { display: false }
    },
    datasets: {
      bar: {
        barPercentage: 0.78,
        categoryPercentage: 0.82
      }
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          color: "#10233f",
          font: { size: 9, weight: "bold" },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          padding: 8
        },
        grid: { color: "#e2e8f0" }
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxValue ? maxValue * 1.45 : undefined,
        ticks: {
          color: "#10233f",
          font: { size: 9, weight: "bold" },
          callback: value => Number(value).toLocaleString()
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };
}

function doughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          font: { size: 9, weight: "bold" },
          color: "#10233f"
        }
      },
      tooltip: {
        callbacks: {
          label(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const value = context.raw;
            const percentage = total === 0 ? 0 : ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} sold (${percentage}%)`;
          }
        }
      }
    }
  };
}

function profitChartOptions(maxValue = null) {
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 8, right: 70, bottom: 18, left: 8 }
    },
    plugins: {
      legend: { display: false }
    },
    datasets: {
      bar: {
        barPercentage: 0.72,
        categoryPercentage: 0.82
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax: maxValue ? maxValue * 1.35 : undefined,
        ticks: {
          color: "#10233f",
          font: { size: 9, weight: "bold" },
          callback: value => "$" + Number(value).toLocaleString()
        },
        grid: { color: "#e2e8f0" }
      },
      y: {
        ticks: {
          color: "#10233f",
          font: { size: 9, weight: "bold" },
          autoSkip: false
        },
        grid: { display: false }
      }
    }
  };
}

function createCharts() {
  const colors = ["#2563eb", "#1e3a8a", "#64748b", "#334155", "#0f172a", "#3b82f6", "#475569", "#0ea5e9", "#1d4ed8"];

  const revenueValues = products.map(product => product.price * product.sold);
  const unitValues = products.map(product => product.sold);
  const topProfitProducts = getTopProfitProducts();
  const profitValues = topProfitProducts.map(product => (product.price - product.cost) * product.sold);

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: products.map(shortName),
      datasets: [{
        data: revenueValues,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: productChartOptions(Math.max(...revenueValues))
  });

  unitsChart = new Chart(document.getElementById("unitsChart"), {
    type: "bar",
    data: {
      labels: products.map(shortName),
      datasets: [{
        data: unitValues,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: productChartOptions(Math.max(...unitValues))
  });

  salesShareChart = new Chart(document.getElementById("salesShareChart"), {
    type: "doughnut",
    data: {
      labels: products.map(shortName),
      datasets: [{
        data: unitValues,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: doughnutOptions()
  });

  profitChart = new Chart(document.getElementById("profitChart"), {
    type: "bar",
    data: {
      labels: topProfitProducts.map(shortName),
      datasets: [{
        data: profitValues,
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: profitChartOptions(Math.max(...profitValues))
  });
}

function updateCharts() {
  const revenueValues = products.map(product => product.price * product.sold);
  const unitValues = products.map(product => product.sold);
  const topProfitProducts = getTopProfitProducts();
  const profitValues = topProfitProducts.map(product => (product.price - product.cost) * product.sold);

  revenueChart.data.labels = products.map(shortName);
  revenueChart.data.datasets[0].data = revenueValues;

  unitsChart.data.labels = products.map(shortName);
  unitsChart.data.datasets[0].data = unitValues;

  salesShareChart.data.labels = products.map(shortName);
  salesShareChart.data.datasets[0].data = unitValues;

  profitChart.data.labels = topProfitProducts.map(shortName);
  profitChart.data.datasets[0].data = profitValues;

  revenueChart.options = productChartOptions(Math.max(...revenueValues));
  unitsChart.options = productChartOptions(Math.max(...unitValues));
  profitChart.options = profitChartOptions(Math.max(...profitValues));

  revenueChart.update();
  unitsChart.update();
  salesShareChart.update();
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

  if (!product) {
    showMessage("Please select a product.", "error");
    return;
  }

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

document.addEventListener("DOMContentLoaded", function () {
  fillDropdown();
  updateCards();
  updateTable();
  createCharts();

  document.getElementById("applyUpdate").addEventListener("click", applyUpdate);
});
