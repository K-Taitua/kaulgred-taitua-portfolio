import sqlite3

DATABASE_NAME = "smartphone_inventory.db"

try:
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    print("=" * 50)
    print("SMARTPHONE INVENTORY DASHBOARD")
    print("=" * 50)

    conn.close()

except Exception as error:
    print("An error occurred:")
    print(error)

input("\nPress Enter to close...")
