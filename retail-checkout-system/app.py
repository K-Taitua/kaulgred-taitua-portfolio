import sqlite3
import pandas as pd

try:
    conn = sqlite3.connect("retail_checkout.db")

    query = "SELECT * FROM Products"
    df_products = pd.read_sql_query(query, conn)

    print("RETAIL INVENTORY DASHBOARD")
    print("\nCurrent Products:\n")
    print(df_products)

    conn.close()

except Exception as error:
    print("An error occurred:")
    print(error)

input("\nPress Enter to close...")
