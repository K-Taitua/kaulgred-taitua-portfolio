function createCharts() {
  const colors = ["#2563eb", "#1e3a8a", "#64748b", "#334155", "#0f172a", "#3b82f6", "#475569", "#0ea5e9", "#1d4ed8"];

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: products.map(product => product.model),
      datasets: [{
        data: products.map(product => product.price * product.sold),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: defaultChartOptions()
  });

  unitsChart = new Chart(document.getElementById("unitsChart"), {
    type: "bar",
    data: {
      labels: products.map(product => product.model),
      datasets: [{
        data: products.map(product => product.sold),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: defaultChartOptions()
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
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: defaultChartOptions()
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
    options: horizontalBarOptions()
  });
}
