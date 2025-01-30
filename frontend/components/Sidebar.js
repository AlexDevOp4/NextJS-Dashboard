import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { FiLogOut, FiMenu, FiX, FiHome, FiUser, FiList } from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // Sidebar state

  // Hide sidebar if user is not logged in
  if (!user) return null;

  return (
    <div
      className={`bg-gray-900 h-screen p-4 flex flex-col ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}
    >
      {/* Sidebar Toggle Button */}
      <button
        className="text-gray-400 text-2xl mb-6 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar Links */}
      <ul className="flex flex-col space-y-4">
        <li>
          <a
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400"
          >
            <FiHome />
            {isOpen && <span>Dashboard</span>}
          </a>
        </li>
        <li>
          <a
            href="/tasks/create"
            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400"
          >
            <FiList />
            {isOpen && <span>Create Task</span>}
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400"
          >
            <FiUser />
            {isOpen && <span>Profile</span>}
          </a>
        </li>
        <li>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-red-500 hover:text-red-400 w-full"
          >
            <FiLogOut />
            {isOpen && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
