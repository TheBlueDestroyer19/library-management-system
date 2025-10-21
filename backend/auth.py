from fastapi import HTTPException
import dbActions

def login_person(email, password):
    """Authenticate a person by email and password."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM persons WHERE email = %s AND password = %s", (email, password))
        person = cursor.fetchone()

        if(person is None):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return person
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def register_person(person):
    """Register a new person in the database."""
    connection = dbActions.create_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM persons WHERE email = %s", (person.email,))
        existing_person = cursor.fetchone()
        if existing_person is not None:
            raise HTTPException(status_code=400, detail="Email already registered")

        if person.role=='L':
            raise HTTPException(status_code=403, detail="Cannot register librarian role")

        cursor.execute(
            "INSERT INTO persons (personID, name, password, email, phone, role) VALUES (%s, %s, %s, %s, %s, %s)",
            (person.id, person.name, person.password, person.email, person.phone,person.role)
        )
        connection.commit()
        return True
    except Exception as e:
        return False
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def verify_librarian(email, password):
    """Verify if the person is a librarian."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM persons WHERE email = %s AND password = %s AND role = 'L'", (email, password))
        librarian = cursor.fetchone()

        if(librarian is None):
            return False

        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during librarian verification: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def verifyLogin(email, password):
    """Verify login credentials for a person."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM persons WHERE email = %s AND password = %s", (email, password))
        person = cursor.fetchone()

        if(person is None):
            return False

        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login verification: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def get_person_by_id(person_id):
    """Fetch a person by their ID."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM persons WHERE personID = %s", (person_id,))
        person = cursor.fetchone()
        cursor.execute("Select * from books where issuedBy = %s", (person_id,))
        issued_books = cursor.fetchall()
        person['issued_books'] = issued_books
        return person
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching person: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def get_admin():
    """Fetch all librarians (admins) from the database."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM persons WHERE role = 'L'")
        admins = cursor.fetchall()
        return admins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching admins: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)