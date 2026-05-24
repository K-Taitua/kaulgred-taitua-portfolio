# Smartphone Inventory Management Dashboard

A smartphone inventory management dashboard for recording sales, restocking products, tracking stock levels, and viewing sales analytics.

---

## Overview

This dashboard was built to manage smartphone inventory and show key sales information in one place. It allows stock levels to be updated, sales to be recorded, and inventory status to be checked using a clean visual dashboard.

The project includes a web dashboard, JavaScript logic, Python database files, and an SQLite database.

---

## Features

- Add stock
- Record sales
- Set stock levels
- View restock alerts
- Track units sold
- Track inventory value
- Track total sales revenue
- View product sales charts
- View sales share by brand
- View top product profitability
- View live inventory table
- Display stock status badges

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Chart.js
- Python
- SQLite

---

## How to Use

Open the dashboard by launching the `index.html` file in a web browser.

The dashboard can also be opened from the portfolio homepage using the **Open Live Dashboard** button.

---

## Inventory Update Controls

Use the control panel on the left side of the dashboard to update inventory.

1. Choose an action:
   - Add Stock
   - Remove Stock / Record Sale
   - Set Stock Level

2. Select a smartphone product.

3. Enter the quantity.

4. Click **Apply Update**.

The dashboard will update the KPI cards, charts, restock alerts, and inventory table.

---

## Stock Status Logic

| Stock Level | Status |
|---|---|
| 0 | Out of Stock |
| 1–5 | Low Stock |
| 6+ | In Stock |

---

## Dashboard Calculations

| Metric | Calculation |
|---|---|
| Sales Revenue | Price × Units Sold |
| Inventory Value | Price × Stock |
| Profitability | (Price - Cost) × Units Sold |

---

## Dashboard Preview

<img width="1904" height="926" alt="Screenshot 2026-05-24 230118" src="https://github.com/user-attachments/assets/517f076c-d214-450e-ab27-2237fd77edc8" />
