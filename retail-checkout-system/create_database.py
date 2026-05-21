import sqlite3

# Connect to the database file
conn = sqlite3.connect("retail_checkout.db")
cursor = conn.cursor()

# Create Products table
cursor.execute("""
CREATE TABLE IF NOT EXISTS Products (
    ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductName TEXT NOT NULL,
    Category TEXT NOT NULL,
    Price REAL NOT NULL,
    StockQuantity INTEGER NOT NULL
)
""")

# Create Sales table
cursor.execute("""
CREATE TABLE IF NOT EXISTS Sales (
    SaleID INTEGER PRIMARY KEY AUTOINCREMENT,
    SaleDate TEXT NOT NULL,
    TotalAmount REAL NOT NULL
)
""")

# Create SaleItems table
cursor.execute("""
CREATE TABLE IF NOT EXISTS SaleItems (
    SaleItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    SaleID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    LineTotal REAL NOT NULL,
    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)
""")

# Sample product data
products = [
    ("Milk 2L", "Dairy", 4.50, 20),
    ("Bread Loaf", "Bakery", 3.20, 15),
    ("Eggs 12 Pack", "Dairy", 8.00, 10),
    ("Apples 1kg", "Produce", 5.50, 18),
    ("Chicken Breast", "Meat", 12.90, 8),
    ("Rice 1kg", "Pantry", 4.80, 25),
    ("Pasta 500g", "Pantry", 2.70, 30),
    ("Toilet Paper 6 Pack", "Household", 7.50, 12)
]

# Add products only if the table is empty
cursor.execute("SELECT COUNT(*) FROM Products")
product_count = cursor.fetchone()[0]

if product_count == 0:
    cursor.executemany("""
    INSERT INTO Products (ProductName, Category, Price, StockQuantity)
    VALUES (?, ?, ?, ?)
    """, products)

# Save changes
conn.commit()

# Display products to confirm setup
cursor.execute("SELECT * FROM Products")
rows = cursor.fetchall()

print("Retail checkout database setup completed.")
print("\nProducts in database:")

for row in rows:
    print(row)

conn.close()
