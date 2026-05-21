 import sqlite3

try:
    conn = sqlite3.connect("retail_checkout.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Products")
    products = cursor.fetchall()

    print("RETAIL INVENTORY DASHBOARD")
    print("\nCurrent Products:\n")

    for product in products:
        print(product)

    conn.close()

except Exception as error:
    print("An error occurred:")
    print(error)

input("\nPress Enter to close...")
