import React from "react";
import { Link } from "react-router-dom";

// Assume isLogin is passed as a prop or obtained from context/store
const isLogin = true;

function Navbar() {
  return (
    <nav className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / App Name */}
          <div className="flex-shrink-0 text-white text-2xl font-semibold tracking-wide">
            📚 Library System
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-white hover:text-blue-200 transition duration-200 font-medium"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-white hover:text-blue-200 transition duration-200 font-medium"
            >
              About
            </Link>

            <Link
              to="/people"
              className="text-white hover:text-blue-200 transition duration-200 font-medium"
            >
              People
            </Link>

            {!isLogin && (
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-semibold transition duration-200"
              >
                Login / Signup
              </Link>
            )}

            {isLogin && (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-blue-200 transition duration-200 font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/auth"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition duration-200"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
