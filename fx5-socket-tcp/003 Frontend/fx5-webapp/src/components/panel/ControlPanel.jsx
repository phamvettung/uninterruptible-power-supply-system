import React, { useState } from 'react'

export default function ControlPanel() {
  const [mode, setMode] = useState("Manual");

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
        width: "250px",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => setMode("Auto")}
        style={{
          flex: 1,
          padding: "10px 20px",
          backgroundColor: mode === "Auto" ? "lime" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        AUTO
      </button>

      <button
        onClick={() => setMode("Manual")}
        style={{
          flex: 1,
          padding: "10px 20px",
          backgroundColor: mode === "Manual" ? "orange" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        MANUAL
      </button>
    </div>
  );
}
