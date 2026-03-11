import sqlite3
import os

# Check common locations
paths = [
    'instance/data_ownership.db',
    'data_ownership.db',
    'backend/instance/data_ownership.db'
]

db_path = None
for p in paths:
    if os.path.exists(p):
        db_path = p
        break

if db_path:
    print(f"Connecting to {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute('ALTER TABLE documents ADD COLUMN blockchain_id INTEGER')
        conn.commit()
        print("Successfully added blockchain_id column to documents table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Column blockchain_id already exists.")
        else:
            print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("Database file not found in common locations.")
