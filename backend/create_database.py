"""
Script to create PostgreSQL database for TradeVelocity
Run this script first before starting the application
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Database credentials
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME', 'tradesense_db')

def create_database():
    """Create the PostgreSQL database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (default 'postgres' database)
        print(f"🔌 Connexion à PostgreSQL sur {DB_HOST}:{DB_PORT}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database='postgres'  # Connect to default database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'")
        exists = cursor.fetchone()
        
        if exists:
            print(f"✅ La base de données '{DB_NAME}' existe déjà!")
        else:
            # Create database
            cursor.execute(f'CREATE DATABASE {DB_NAME}')
            print(f"✅ Base de données '{DB_NAME}' créée avec succès!")
        
        cursor.close()
        conn.close()
        
        # Test connection to new database
        print(f"\n🔍 Test de connexion à '{DB_NAME}'...")
        test_conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        print(f"✅ Connexion à '{DB_NAME}' réussie!")
        test_conn.close()
        
        print("\n🎉 Configuration PostgreSQL terminée avec succès!")
        print(f"📊 Vous pouvez maintenant démarrer votre application avec: python app.py")
        
        return True
        
    except psycopg2.Error as e:
        print(f"\n❌ Erreur PostgreSQL: {e}")
        print("\n💡 Vérifications à faire:")
        print("   1. PostgreSQL est-il démarré? (Vérifiez dans Services Windows)")
        print("   2. Le mot de passe est-il correct?")
        print("   3. L'utilisateur 'postgres' existe-t-il?")
        return False
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Configuration de la base de données PostgreSQL")
    print("=" * 60)
    print(f"\n📋 Paramètres:")
    print(f"   Host: {DB_HOST}")
    print(f"   Port: {DB_PORT}")
    print(f"   Utilisateur: {DB_USER}")
    print(f"   Base de données: {DB_NAME}")
    print()
    
    create_database()
