"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    // Show a loading spinner or placeholder while checking auth state
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return user ? children : null;
};

export default ProtectedRoute;
