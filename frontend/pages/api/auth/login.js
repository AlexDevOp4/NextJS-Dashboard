"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { user, loading, setUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(password);

    try {
      login(email, password);
      console.log("first");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              message.includes("successful") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
