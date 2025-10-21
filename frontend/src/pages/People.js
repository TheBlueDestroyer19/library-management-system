import React, { useEffect, useState } from "react";

function People() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch("http://localhost:8000/persons/admin"); // fixed 'https' typo
        const data = await response.json();
        setPeople(data.admin);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-16 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
        Our Amazing Team 👥
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {people.map((person) => (
          <div
            key={person.id}
            className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 transition-transform transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-blue-600">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {person.name}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Role:</span> {person.role}
              </p>
              <p className="text-gray-500 text-sm">{person.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
