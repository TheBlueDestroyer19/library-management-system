import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import People from "./pages/People";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/people" element={<People />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
