import React from "react";

export default function RouletteHistory({ list }) {
  return (
    <div className="history">
      <h3>Recent Spins</h3>
      {list && list.length > 0 ? (
        <ul>
          {list.map((spin) => (
            <li key={spin._id} className={spin.color}>
              <span className="num">{spin.number}</span>
              <span className="color">{spin.color}</span>
              <span className="time">
                {new Date(spin.createdAt).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No spins yet</p>
      )}
    </div>
  );
}
