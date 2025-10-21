from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import auth
import bookActions
# ----------------------------------------------------

app = FastAPI(
    title="Library Management System",
    description="Backend API built using FastAPI (Python + C++)",
    version="1.0.0"
)

# ----------------------------------------------------
# ⚙️ MIDDLEWARE SECTION
# ----------------------------------------------------

# Example 1: Allow requests from other origins (frontend, mobile apps, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------

# 📦 DATA MODELS SECTION
class Person(BaseModel):
    id: int
    name: str
    password: str
    email: str
    phone: str
    role: str

class Book(BaseModel):
    id: int
    title: str
    amount: float

class LoginRequest(BaseModel):
    email: str
    password: str

# ----------------------------------------------------

# 🚀 API ENDPOINTS SECTION

@app.get("/")
def get_all_books():
    books=bookActions.get_all_books()
    return {"books":books}

@app.get("/books/{book_id}")
def get_book_by_id(book_id: int):
    book=bookActions.get_book_by_id(book_id)
    return {"book":book}

@app.post("/books/")
def add_new_book(book: Book):
    success=bookActions.add_new_book(book)
    if success:
        return {"message":"Book added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Error adding book") 

@app.post("/persons/login")
def person_login(login_request: LoginRequest):
    email, password = login_request.email, login_request.password
    person=auth.login_person(email, password)
    return {"person":person}

@app.get("/persons/admin")
def get_admin():
    persons=auth.get_admin()
    return {"admin":persons}

@app.post("/persons/register")
def person_register(person: Person, x_email: str=Header(None, alias="X-Email"), x_password: str=Header(None, alias="X-Password")):
    if not auth.verify_librarian(x_email, x_password):
        raise HTTPException(status_code=403, detail="Unauthorized to register new persons")

    success=auth.register_person(person)
    if success:
        return {"message":"Person registered successfully"}
    else:
        raise HTTPException(status_code=500, detail="Error registering person")

@app.get("/persons/{person_id}")
def get_person_by_id(person_id: int):
    return {"person":auth.get_person_by_id(person_id)}

@app.post("/books/issue/{book_id}")
def issue_book_to_person(book_id: int, x_email: str=Header(None, alias="X-Email"), x_password: str=Header(None, alias="X-Password")):
    if not auth.verifyLogin(x_email, x_password):
        raise HTTPException(status_code=403, detail="Login required to issue books")

    bookData=bookActions.issue_book(book_id, x_email)
    return {"message":"Successfully Issued the Book","due_date":bookData}

@app.post("/books/return/{book_id}")
def return_book_from_person(book_id: int, x_email: str=Header(None, alias="X-Email"), x_password: str=Header(None, alias="X-Password")):
    if not auth.verifyLogin(x_email, x_password):
        raise HTTPException(status_code=403, detail="Login required to return books")

    bookData=bookActions.return_book(book_id, x_email)
    return {"message":"Successfully returned the book", "fine":bookData}

@app.post("/persons/fine")
def pay_fine(x_email: str=Header(None, alias="X-Email"), x_password: str=Header(None, alias="X-Password")):
    if not auth.verifyLogin(x_email, x_password):
        raise HTTPException(status_code=403, detail="Login required to pay fines")
    bookActions.pay_fine(x_email)
    return {"message":"Fine paid successfully"}
    

# ----------------------------------------------------