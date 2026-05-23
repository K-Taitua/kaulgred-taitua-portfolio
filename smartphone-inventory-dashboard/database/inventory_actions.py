import sqlite3

# ----------------------------------------
# DATABASE CONNECTION
# ----------------------------------------

DATABASE_NAME = "smartphone_inventory.db"

conn = sqlite3.connect(DATABASE_NAME)
cursor = conn.cursor()

# ----------------------------------------
# SHOW PRODUCTS
# ----------------------------------------

print("\nSMARTPHONE INVENTORY\n")
print("-" * 70)

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

print("-" * 70)

# ----------------------------------------
# RECORD SALE
# ----------------------------------------

try:

    product_id = int(input("\nEnter Product ID: "))
    quantity_sold = int(input("Enter Quantity Sold: "))

    # ----------------------------------------
    # GET PRODUCT
    # ----------------------------------------

    cursor.execute("""
    SELECT Brand, Model, StockQuantity, UnitsSold, Price
    FROM Products
    WHERE ProductID = ?
    """, (product_id,))

    product = cursor.fetchone()

    if product is None:

        print("\nProduct not found.")

    else:

        brand = product[0]
        model = product[1]
        current_stock = product[2]
        current_units_sold = product[3]
        price = product[4]

        # ----------------------------------------
        # VALIDATION
        # ----------------------------------------

        if quantity_sold <= 0:

            print("\nQuantity must be greater than 0.")

        elif quantity_sold > current_stock:

            print("\nNot enough stock available.")

        else:

            # ----------------------------------------
            # UPDATE VALUES
            # ----------------------------------------

            new_stock = current_stock - quantity_sold
            new_units_sold = current_units_sold + quantity_sold

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

            # ----------------------------------------
            # SUCCESS MESSAGE
            # ----------------------------------------

            total_sale = price * quantity_sold

            print("\nSale recorded successfully.")
            print(
                f"{quantity_sold} x "
                f"{brand} {model} sold."
            )

            print(f"Sale Total: ${total_sale:,.2f}")
            print(f"Updated Stock: {new_stock}")

except Exception as error:

    print("\nAn error occurred:")
    print(error)

# ----------------------------------------
# CLOSE CONNECTION
# ----------------------------------------

conn.close()

input("\nPress Enter to close...")
