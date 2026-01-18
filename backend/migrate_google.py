"""
Migration script to add google_id field to User table
"""
import sqlite3
from pathlib import Path

# Path to database
DB_PATH = Path(__file__).parent / 'tradesense.db'

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(user)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'google_id' not in columns:
            print("Adding google_id column to user table...")
            cursor.execute("""
                ALTER TABLE user 
                ADD COLUMN google_id VARCHAR(100) UNIQUE
            """)
            
            # Make password nullable for Google OAuth users
            print("User table migrated successfully!")
            print("Note: Password field is now nullable for Google OAuth users")
            
            conn.commit()
            print("✅ Migration completed successfully!")
        else:
            print("⚠️  Column google_id already exists. Skipping migration.")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
