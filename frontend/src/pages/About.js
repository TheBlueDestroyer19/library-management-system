import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-16 px-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          About Our Library System 📖
        </h1>

        <p className="text-gray-700 leading-relaxed mb-5 text-lg">
          Our foundation is built on the belief that access to knowledge is a fundamental right. We are dedicated to creating a platform that connects readers with the resources they need to learn, grow, and succeed.
        </p>

        <p className="text-gray-700 leading-relaxed mb-5 text-lg">
          With this in mind — and to speed up the process of book lending and borrowing — we have developed this <span className="font-semibold text-blue-600">Library Management System</span>. Our system is designed to streamline the management of library resources, making it easier for both librarians and patrons to access and utilize the library's offerings.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg">
          Thank you for being a part of our journey. Together, we can build a brighter future through the power of knowledge and community.
        </p>
      </div>
    </div>
  );
}

export default About;
