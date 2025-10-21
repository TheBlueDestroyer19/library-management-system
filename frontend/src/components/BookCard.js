import React from "react";

function BookCard({ props }) {
  const { id, item } = props;
  const { ImageSrc, title, author, issuedBy } = item;
  const isAvailabe = issuedBy === null;

  const issueBook =async () => {
    if (!isAvailabe) return;
    try {
      const response = await fetch(`http://localhost:8000/books/issue/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Email': sessionStorage.getItem('email'),
          'X-Password': sessionStorage.getItem('password')
        }
      });
      const data = await response.json();
      if(response.ok){
        alert(`Book issued successfully!\nDue Date: ${data.due_date}`);
        window.location.reload();
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Error issuing book:", error);
      alert('An error occurred while issuing the book.');
    }
  }

  return (
    <div
      id={id}
      className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 w-72"
    >
      {/* Book Image */}
      <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={ImageSrc}
          alt={title}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-gray-600 mt-1 text-sm">by {author}</p>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              isAvailabe
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isAvailabe ? "Available" : "Not Available"}
          </span>

          <button
            className={`px-4 py-1 text-sm font-semibold rounded-lg transition-all duration-300 ${
              isAvailabe
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isAvailabe}
            onClick={issueBook}
          >
            {isAvailabe ? "Borrow" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
