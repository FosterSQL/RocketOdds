import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";

import RouletteWheel from "./components/RouletteWheel";
import RouletteHistory from "./components/RouletteHistory";

export default function App() {
  const { user, token, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(null);
  const [history, setHistory] = useState([]);

  // Load recent spins on first visit
  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    try {
      const res = await fetch("/api/recent");
      const data = await res.json();
      if (data.ok) {
        setHistory(data.spins);
        if (data.spins.length > 0) setLast(data.spins[0]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function spin(bet) {
    if (!user) {
      alert("You must be logged in to place bets.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bet)
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.error);
        return;
      }

      // Update last result + history
      setLast(data.result);
      fetchRecent();

      // Update AuthContext user balance
      const updatedUser = { ...user, balance: data.newBalance };
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>RocketOdds</h1>
        <nav>
          <Link to="/">Home</Link> {" | "}

          {user ? (
            <>
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
              <>
                <RouletteWheel
                  last={last}
                  loading={loading}
                  onSpin={spin}
                />

                <RouletteHistory history={history} />
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
