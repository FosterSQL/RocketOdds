import React from "react";

export default function RouletteWheel({ last, loading, onSpin }) {
  return (
    <div className="wheel">
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

      <button onClick={onSpin} disabled={loading}>
        {loading ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
}
