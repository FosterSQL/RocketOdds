import React, { useState } from "react";

export default function RouletteWheel({ last, loading, onSpin }) {
  const [amount, setAmount] = useState(10);
  const [betType, setBetType] = useState("color");
  const [betValue, setBetValue] = useState("red");

  function submitSpin() {
    onSpin({
      amount: Number(amount),
      betType,
      betValue
    });
  }

  return (
    <div className="wheel">

      {/* Last result */}
      <div className="last">
        {last ? (
          <>
            <div className={`chip ${last.color}`}>{last.number}</div>
            <div className="timestamp">
              {new Date(last.createdAt).toLocaleTimeString()}
            </div>
          </>
        ) : (
          <div>No spin yet</div>
        )}
      </div>

      {/* Betting UI */}
      <div className="bet-panel" style={{ marginTop: 20 }}>
        <h3>Place Your Bet</h3>

        {/* Bet amount */}
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Bet amount"
          style={{ marginBottom: 10 }}
        />

        {/* Bet type */}
        <select
          value={betType}
          onChange={(e) => {
            setBetType(e.target.value);
            // reset default bet value
            setBetValue(e.target.value === "color" ? "red" : "0");
          }}
          style={{ marginBottom: 10 }}
        >
          <option value="color">Color (Red/Black/Green)</option>
          <option value="number">Single Number</option>
        </select>

        {/* Bet value */}
        {betType === "color" ? (
          <select
            value={betValue}
            onChange={(e) => setBetValue(e.target.value)}
          >
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="green">Green</option>
          </select>
        ) : (
          <input
            type="number"
            min="0"
            max="36"
            value={betValue}
            onChange={(e) => setBetValue(e.target.value)}
            placeholder="0–36"
          />
        )}
      </div>

      {/* Spin button */}
      <button
        onClick={submitSpin}
        disabled={loading}
        style={{ marginTop: 15 }}
      >
        {loading ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
}
