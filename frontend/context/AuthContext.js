"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserByToken = useCallback(async (token) => {
    try {
      const response = await api.get(`/users/${token}`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserByToken(token);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [getUserByToken]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token); // Save token
      setUser([user]);
      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
