import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Define pages where the sidebar should be hidden
  const hiddenSidebarRoutes = ["/", "/register"];

  if (loading)
    return <div className="text-gray-400 text-center mt-10">Loading...</div>;

  return (
    <div className="flex">
      {/* Show Sidebar only if user is logged in and not on login/register pages */}
      {user && !hiddenSidebarRoutes.includes(router.pathname) && <Sidebar />}
      <div className="flex-1 p-6">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
