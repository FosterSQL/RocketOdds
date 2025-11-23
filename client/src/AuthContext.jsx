import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user from backend using token
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.ok) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }

      setLoading(false);
    }

    fetchUser();
  }, [token]);

  // LOGIN
  async function login(email, password) {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.ok) return { ok: false, error: data.error };

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { ok: true };
  }

  // REGISTER
  async function register(form) {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    return await res.json();
  }

  // LOGOUT
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
