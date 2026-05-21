import sqlite3

try:
    conn = sqlite3.connect("retail_checkout.db")
    cursor = conn.cursor()

    # Get all products
    cursor.execute("SELECT * FROM Products")
    products = cursor.fetchall()

    # Dashboard totals
    cursor.execute("SELECT COUNT(*) FROM Products")
    total_products = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(StockQuantity) FROM Products")
    total_stock = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Products WHERE StockQuantity <= 10")
    low_stock = cursor.fetchone()[0]

    print("=" * 50)
    print("RETAIL INVENTORY DASHBOARD")
    print("=" * 50)

    print(f"\nTotal Products: {total_products}")
    print(f"Total Stock Quantity: {total_stock}")
    print(f"Low Stock Items: {low_stock}")

    print("\nPRODUCT INVENTORY")
    print("-" * 50)

    for product in products:
        print(product)

    conn.close()

except Exception as error:
    print("An error occurred:")
    print(error)

input("\nPress Enter to close...")
