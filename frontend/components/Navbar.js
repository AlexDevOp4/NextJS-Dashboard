"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // For mobile menu icon

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold text-blue-400 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:text-blue-400 transition">
              Profile
            </a>
          </li>
          {user ? (
            <li>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <a
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                Login
              </a>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col bg-gray-800 mt-2 p-4 rounded-lg">
          <li>
            <a
              href="/dashboard"
              className="block py-2 text-center hover:text-blue-400 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="block py-2 text-center hover:text-blue-400 transition"
            >
              Profile
            </a>
          </li>
          {user ? (
            <li>
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 mt-2 rounded transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <a
                href="/login"
                className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 mt-2 rounded transition"
              >
                Login
              </a>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
