from fastapi import HTTPException
import dbActions

def get_all_books():
    """Fetch all books from the database."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM books")
        books = cursor.fetchall()
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def get_book_by_id(book_id):
    """Fetch a book by its ID."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM books WHERE bookID = %s", (book_id,))
        book = cursor.fetchone()
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching book: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def add_new_book(book):
    """Add a new book to the database."""
    connection = dbActions.create_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO books (bookID, title, amount) VALUES (%s,%s, %s)",
            (book.id, book.title, book.amount)
        )
        connection.commit()
        return True
    except Exception as e:
        print(f"Error adding book: {e}")
        return False
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def issue_book(book_id, email):
    """Issue a book to a person."""
    connection = dbActions.create_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute("SELECT personID FROM persons WHERE email = %s", (email,))
        person = cursor.fetchone()[0]
        cursor.execute("select issuedBy from books where bookID= %s", (book_id,))
        issuedBy = cursor.fetchone()[0]

        if issuedBy is not None:
            raise HTTPException(status_code=400, detail="Book is already issued to someone else")
        
        cursor.execute("UPDATE books SET DueDate = DATE_ADD(CURDATE(), INTERVAL 14 DAY), issuedBy = %s WHERE bookID = %s", (person, book_id))
        connection.commit()

        cursor.execute("select DueDate from books where bookID= %s", (book_id,))
        dueDate = cursor.fetchone()[0] 
        return dueDate

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error issuing book: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def return_book(book_id, email):
    """Return a book from a person."""
    connection = dbActions.create_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute("SELECT personID FROM persons WHERE email = %s", (email,))
        person = cursor.fetchone()[0]
        cursor.execute("select issuedBy,DueDate from books where bookID= %s", (book_id,))
        issuedBy, DueDate = cursor.fetchone()

        if issuedBy != person:
            raise HTTPException(status_code=400, detail="This book was not issued to you")
        
        cursor.execute("UPDATE books SET DueDate = NULL, issuedBy = NULL WHERE bookID = %s", (book_id,))

        cursor.execute("update persons set Fine= COALESCE(Fine,0)+ CASE WHEN DATEDIFF(CURDATE(), %s) > 0 THEN DATEDIFF(CURDATE(), %s)*10 ELSE 0 END WHERE personID= %s", (DueDate,DueDate,person))

        cursor.execute("select Fine from persons where personID= %s", (person,))
        fine = cursor.fetchone()[0]

        connection.commit()
        return fine
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error returning book: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)

def pay_fine(email):
    """Pay fine for a person."""
    connection = dbActions.create_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE persons SET Fine = 0 WHERE email = %s", (email,))
        connection.commit()
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error paying fine: {e}")
    finally:
        cursor.close()
        dbActions.close_connection(connection)


