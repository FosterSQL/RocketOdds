import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header>
        <h1>RocketOdds</h1>
        <nav>
          <Link to="/">Home</Link> {" | "}

          {user ? (
            <>
              <Link to="/profile">Profile</Link> {" | "}
              <span style={{ marginLeft: 8 }}>
                Hi, {user.username} (${user.balance})
              </span>
              <button onClick={logout} style={{ marginLeft: 8 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link> {" | "}
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
