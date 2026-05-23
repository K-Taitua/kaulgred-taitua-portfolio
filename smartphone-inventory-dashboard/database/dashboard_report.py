import sqlite3

# ----------------------------------------
# DATABASE CONNECTION
# ----------------------------------------

DATABASE_NAME = "smartphone_inventory.db"

try:

    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    print("=" * 90)
    print("SMARTPHONE INVENTORY MANAGEMENT DASHBOARD")
    print("=" * 90)

    # ----------------------------------------
    # DASHBOARD SUMMARY
    # ----------------------------------------

    cursor.execute("SELECT SUM(Price * UnitsSold) FROM Products")
    total_revenue = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(UnitsSold) FROM Products")
    total_units_sold = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(Price) FROM Products")
    average_product_price = cursor.fetchone()[0]

    print(f"\nTotal Revenue:          ${total_revenue:,.2f}")
    print(f"Units Sold:             {total_units_sold}")
    print(f"Average Product Price:  ${average_product_price:,.2f}")

    # ----------------------------------------
    # INVENTORY TABLE
    # ----------------------------------------

    print("\n" + "=" * 90)
    print("INVENTORY TABLE")
    print("=" * 90)

    header = (
        f"{'Brand':<12}"
        f"{'Model':<25}"
        f"{'Storage':<10}"
        f"{'Price':<12}"
        f"{'Stock':<10}"
        f"{'Sold':<10}"
        f"{'Value':<15}"
        f"{'Status':<15}"
    )

    print(header)
    print("-" * 90)

    cursor.execute("""
    SELECT
        Brand,
        Model,
        Storage,
        Price,
        StockQuantity,
        UnitsSold
    FROM Products
    """)

    products = cursor.fetchall()

    for product in products:

        brand = product[0]
        model = product[1]
        storage = product[2]
        price = product[3]
        stock = product[4]
        sold = product[5]

        inventory_value = price * stock

        # ----------------------------------------
        # STOCK STATUS LOGIC
        # ----------------------------------------

        if stock == 0:
            status = "Out of Stock"

        elif stock <= 5:
            status = "Low Stock"

        else:
            status = "In Stock"

        row = (
            f"{brand:<12}"
            f"{model:<25}"
            f"{storage:<10}"
            f"${price:<11,.2f}"
            f"{stock:<10}"
            f"{sold:<10}"
            f"${inventory_value:<14,.2f}"
            f"{status:<15}"
        )

        print(row)

    print("\n" + "=" * 90)
    print("Dashboard report generated successfully.")
    print("=" * 90)

    conn.close()

except Exception as error:

    print("\nAn error occurred:")
    print(error)

input("\nPress Enter to close...")
