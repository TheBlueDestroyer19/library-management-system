import mysql.connector
from mysql.connector import Error
from fastapi import HTTPException

def create_connection():
    """Create a database connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="python_user",
            password="mypassword",
            database="library_db",
            auth_plugin='mysql_native_password'
        )
        if connection.is_connected():
            print("Connection to MySQL database was successful")
            return connection
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to database: {e}")

def close_connection(connection):
    """Close the database connection."""
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection is closed")