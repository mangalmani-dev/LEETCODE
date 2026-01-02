import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";



import LandingPage from "./page/LandingPage.jsx";
import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/LoginPage.jsx";
import SignupPage from "./page/SignupPage.jsx";

import ProblemPage from "./page/ProblemPage.jsx";
import AddProblem from "./page/AddProblem.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import ProfilePage from "./page/ProfilePage.jsx";
import Pricing from "./page/PricingPage.jsx";



function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();



  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Pages where Navbar must not show
  const hiddenNavbarRoutes = ["/login", "/signup", "/"];
  const hideNavbar = hiddenNavbarRoutes.includes(location.pathname) || !authUser;

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  return (
    <div>
      <Toaster />

     

      {/* Navbar Visible Only When User Logged In */}
      {!hideNavbar && <Navbar />}

    
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Home Page (Protected) */}
        <Route
          path="/home"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/home" replace />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/home" replace />}
        />

        {/* Problem Page (Protected) */}
        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to="/login" replace />}
        />

        {/* Profile Page (Protected) */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
        />

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/login" replace />}
          />
        </Route>

              <Route path="/pricing" element={<Pricing />} />

        {/* Fallback for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
