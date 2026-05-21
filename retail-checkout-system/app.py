import sqlite3
import pandas as pd

conn = sqlite3.connect("retail_checkout.db")

query = "SELECT * FROM Products"

df_products = pd.read_sql_query(query, conn)

print("RETAIL INVENTORY DASHBOARD")
print("\nCurrent Products:\n")

print(df_products)

conn.close()

input("\nPress Enter to close...")
