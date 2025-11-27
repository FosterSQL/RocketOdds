import React, { useEffect, useState } from "react";
import RouletteWheel from "../components/RouletteWheel";
import RouletteHistory from "../components/RouletteHistory";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user, updateUser } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(null);

  // Fetch the last 20 spins
  async function fetchHistory() {
    try {
      const res = await fetch("/api/spin/recent");
      const data = await res.json();
      if (data.ok) setHistory(data.list);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  // Called when user presses Spin
  async function handleSpin({ amount, betType, betValue }) {
    if (amount <= 0) return alert("Enter a valid bet amount");

    setLoading(true);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ amount, betType, betValue }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.error || "Spin failed");
        return;
      }

      // Update UI
      setLast(data.result);
      fetchHistory();

      // Update user balance in global auth context
      if (data.newBalance !== undefined) {
        updateUser({ ...user, balance: data.newBalance });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">

      <h2>Roulette</h2>
      <p>Your balance: ${user?.balance}</p>

      <RouletteWheel
        last={last}
        loading={loading}
        onSpin={handleSpin}
      />

      <RouletteHistory list={history} />
    </div>
  );
}
