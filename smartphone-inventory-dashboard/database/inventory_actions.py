import sqlite3

# ----------------------------------------
# DATABASE CONNECTION
# ----------------------------------------

DATABASE_NAME = "smartphone_inventory.db"

conn = sqlite3.connect(DATABASE_NAME)
cursor = conn.cursor()

# ----------------------------------------
# SHOW INVENTORY
# ----------------------------------------

def show_inventory():

    print("\nSMARTPHONE INVENTORY")
    print("-" * 90)

    cursor.execute("""
    SELECT ProductID, Brand, Model, Storage, Price, StockQuantity
    FROM Products
    """)

    products = cursor.fetchall()

    for product in products:

        product_id = product[0]
        brand = product[1]
        model = product[2]
        storage = product[3]
        price = product[4]
        stock = product[5]

        print(
            f"{product_id}. "
            f"{brand} {model} {storage} | "
            f"Price: ${price:,.2f} | "
            f"Stock: {stock}"
        )

    print("-" * 90)

# ----------------------------------------
# RECORD SALE
# ----------------------------------------

def record_sale():

    product_id = int(input("\nEnter Product ID: "))
    quantity = int(input("Enter Quantity Sold: "))

    cursor.execute("""
    SELECT Brand, Model, StockQuantity, UnitsSold, Price
    FROM Products
    WHERE ProductID = ?
    """, (product_id,))

    product = cursor.fetchone()

    if product is None:

        print("\nProduct not found.")
        return

    brand = product[0]
    model = product[1]
    current_stock = product[2]
    current_units_sold = product[3]
    price = product[4]

    if quantity <= 0:

        print("\nQuantity must be greater than 0.")

    elif quantity > current_stock:

        print("\nNot enough stock available.")

    else:

        new_stock = current_stock - quantity
        new_units_sold = current_units_sold + quantity

        cursor.execute("""
        UPDATE Products
        SET
            StockQuantity = ?,
            UnitsSold = ?,
            LastUpdated = datetime('now')
        WHERE ProductID = ?
        """, (
            new_stock,
            new_units_sold,
            product_id
        ))

        conn.commit()

        total_sale = price * quantity

        print("\nSale recorded successfully.")
        print(f"{quantity} x {brand} {model} sold.")
        print(f"Sale Total: ${total_sale:,.2f}")
        print(f"Updated Stock: {new_stock}")

# ----------------------------------------
# RESTOCK PRODUCT
# ----------------------------------------

def restock_product():

    product_id = int(input("\nEnter Product ID: "))
    quantity = int(input("Enter Restock Quantity: "))

    cursor.execute("""
    SELECT Brand, Model, StockQuantity
    FROM Products
    WHERE ProductID = ?
    """, (product_id,))

    product = cursor.fetchone()

    if product is None:

        print("\nProduct not found.")
        return

    brand = product[0]
    model = product[1]
    current_stock = product[2]

    if quantity <= 0:

        print("\nQuantity must be greater than 0.")

    else:

        new_stock = current_stock + quantity

        cursor.execute("""
        UPDATE Products
        SET
            StockQuantity = ?,
            LastUpdated = datetime('now')
        WHERE ProductID = ?
        """, (
            new_stock,
            product_id
        ))

        conn.commit()

        print("\nProduct restocked successfully.")
        print(f"{quantity} units added.")
        print(f"Updated Stock: {new_stock}")

# ----------------------------------------
# ADJUST STOCK
# ----------------------------------------

def adjust_stock():

    product_id = int(input("\nEnter Product ID: "))
    adjustment = int(input("Enter Stock Adjustment (+/-): "))

    cursor.execute("""
    SELECT Brand, Model, StockQuantity
    FROM Products
    WHERE ProductID = ?
    """, (product_id,))

    product = cursor.fetchone()

    if product is None:

        print("\nProduct not found.")
        return

    brand = product[0]
    model = product[1]
    current_stock = product[2]

    new_stock = current_stock + adjustment

    if new_stock < 0:

        print("\nStock cannot go below 0.")

    else:

        cursor.execute("""
        UPDATE Products
        SET
            StockQuantity = ?,
            LastUpdated = datetime('now')
        WHERE ProductID = ?
        """, (
            new_stock,
            product_id
        ))

        conn.commit()

        print("\nStock adjusted successfully.")
        print(f"Updated Stock: {new_stock}")

# ----------------------------------------
# MAIN MENU
# ----------------------------------------

while True:

    print("\n" + "=" * 90)
    print("SMARTPHONE INVENTORY MANAGEMENT SYSTEM")
    print("=" * 90)

    print("\n1. View Inventory")
    print("2. Record Sale")
    print("3. Restock Product")
    print("4. Adjust Stock")
    print("5. Exit")

    choice = input("\nSelect an option: ")

    if choice == "1":

        show_inventory()

    elif choice == "2":

        show_inventory()
        record_sale()

    elif choice == "3":

        show_inventory()
        restock_product()

    elif choice == "4":

        show_inventory()
        adjust_stock()

    elif choice == "5":

        print("\nExiting system...")
        break

    else:

        print("\nInvalid option selected.")

# ----------------------------------------
# CLOSE CONNECTION
# ----------------------------------------

conn.close()
