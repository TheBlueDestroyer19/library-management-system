import React, { useEffect, useState } from "react";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const id = sessionStorage.getItem("id");
      try {
        const response = await fetch(`http://localhost:8000/persons/${id}`);
        const data = await response.json();
        setProfileData(data.person);
      } catch (err) {
        setError("Error fetching profile data");
      }
    };
    fetchProfile();
  }, []);

  const returnBookHandler =async (id) => {
    try{
      const response=await fetch(`http://localhost:8000/books/return/${id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          'X-Email':sessionStorage.getItem("email"),
          'X-Password':sessionStorage.getItem("password")
        }
      });
      const data=await response.json();
      if(data.message==="Successfully returned the book") {
        alert(`Book returned successfully\nFine Due: Rs. ${data.fine}`);
        window.location.reload();
      }
      else 
        alert(`${data.detail}`);
    } catch(err){
      alert("Error returning the book");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl w-full border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
            {profileData.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {profileData.name}
          </h2>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Email:</span> {profileData.email}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Phone:</span> {profileData.phone}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">Role:</span> {profileData.role}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Borrowed Books
          </h3>
          {profileData.issued_books && profileData.issued_books.length > 0 ? (
            <ul className="space-y-4">
              {profileData.issued_books.map((book) => (
                <li
                  key={book.bookID}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
                >
                  <p className="text-gray-800 font-medium text-lg">
                    {book.title}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    by {book.Author} —{" "}
                    <span className="font-semibold text-gray-700">
                      Due: {book.DueDate}
                    </span>
                  </p>
                  {/* Return Book Button */}
                  <button
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                    onClick={()=>returnBookHandler(book.bookID)}
                  >
                    Return Book
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic mt-3">
              You have not borrowed any books yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;