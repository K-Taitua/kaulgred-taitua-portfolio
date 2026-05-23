import sqlite3

# ----------------------------------------
# DATABASE CONNECTION
# ----------------------------------------

DATABASE_NAME = "smartphone_inventory.db"

conn = sqlite3.connect(DATABASE_NAME)
cursor = conn.cursor()

print("Connected to database successfully.")

# ----------------------------------------
# DROP OLD TABLES (FOR REBUILDING)
# ----------------------------------------

cursor.execute("DROP TABLE IF EXISTS SaleItems")
cursor.execute("DROP TABLE IF EXISTS Sales")
cursor.execute("DROP TABLE IF EXISTS StockMovements")
cursor.execute("DROP TABLE IF EXISTS Products")

# ----------------------------------------
# CREATE PRODUCTS TABLE
# ----------------------------------------

cursor.execute("""
CREATE TABLE Products (
    ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
    Brand TEXT NOT NULL,
    Model TEXT NOT NULL,
    Storage TEXT NOT NULL,
    Price REAL NOT NULL,
    StockQuantity INTEGER NOT NULL,
    UnitsSold INTEGER NOT NULL,
    LastUpdated TEXT NOT NULL
)
""")

# ----------------------------------------
# CREATE SALES TABLE
# ----------------------------------------

cursor.execute("""
CREATE TABLE Sales (
    SaleID INTEGER PRIMARY KEY AUTOINCREMENT,
    SaleDate TEXT NOT NULL,
    TotalAmount REAL NOT NULL
)
""")

# ----------------------------------------
# CREATE SALE ITEMS TABLE
# ----------------------------------------

cursor.execute("""
CREATE TABLE SaleItems (
    SaleItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    SaleID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice REAL NOT NULL,
    LineTotal REAL NOT NULL,

    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)
""")

# ----------------------------------------
# CREATE STOCK MOVEMENTS TABLE
# ----------------------------------------

cursor.execute("""
CREATE TABLE StockMovements (
    MovementID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductID INTEGER NOT NULL,
    MovementType TEXT NOT NULL,
    Quantity INTEGER NOT NULL,
    MovementDate TEXT NOT NULL,

    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)
""")

# ----------------------------------------
# INSERT SMARTPHONE PRODUCTS
# ----------------------------------------

products = [

    ("Apple", "iPhone 16 Pro", "256GB", 2199, 12, 34, "2026-05-22"),
    ("Apple", "iPhone 16", "128GB", 1599, 18, 28, "2026-05-22"),

    ("Samsung", "Galaxy S25 Ultra", "256GB", 2399, 9, 31, "2026-05-22"),
    ("Samsung", "Galaxy S25", "256GB", 1599, 14, 25, "2026-05-22"),

    ("Google", "Pixel 9 Pro", "256GB", 1749, 7, 19, "2026-05-22"),
    ("Google", "Pixel 9", "128GB", 1289, 11, 16, "2026-05-22"),

    ("OnePlus", "OnePlus 13", "256GB", 1284, 6, 14, "2026-05-22"),

    ("Xiaomi", "Redmi Note 15 Pro", "256GB", 696, 22, 11, "2026-05-22"),
    ("Xiaomi", "Redmi Note 15", "256GB", 596, 25, 8, "2026-05-22")

]

cursor.executemany("""
INSERT INTO Products (
    Brand,
    Model,
    Storage,
    Price,
    StockQuantity,
    UnitsSold,
    LastUpdated
)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", products)

# ----------------------------------------
# SAVE CHANGES
# ----------------------------------------

conn.commit()

print("Database tables created successfully.")
print("Smartphone products inserted successfully.")

# ----------------------------------------
# CLOSE CONNECTION
# ----------------------------------------

conn.close()

print("Database setup complete.")
