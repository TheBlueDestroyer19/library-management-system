import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("http://localhost:8000/");
        const jsonData = await response.json();
        setData(jsonData.books);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
        📚 Library Collection
      </h1>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-10">
        {data.length > 0 ? (
          data.map((item) => (
            <BookCard key={item.bookID} props={{ id: item.bookID, item }} />
          ))
        ) : (
          <p className="text-gray-500 text-lg mt-10">
            Loading books... or none available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
