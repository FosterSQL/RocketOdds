import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);

    const res = await login(form.email, form.password);

    if (!res.ok) return setError(res.error);

    navigate("/");
  }

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input
          placeholder="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>
      </form>
      {error && <div style={{ color: "salmon" }}>{error}</div>}
    </div>
  );
}
