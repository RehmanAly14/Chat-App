import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/auth";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, checkAuth, isChekingAuth ,onlineUsers} = useAuthStore();
  console.log(onlineUsers);
   const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isChekingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <main className="pt-16">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" replace />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>
      </main>

      <Toaster />
    </div>
  );
}

export default App;
