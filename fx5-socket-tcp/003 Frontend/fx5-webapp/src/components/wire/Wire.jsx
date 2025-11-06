import React from 'react'

export default function Wire({ x1, y1, x2, y2, color = "black", thickness = 2, dashline = 0 }) {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // allows clicks to pass through
        zIndex: 0,
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={dashline}
      />
    </svg>
  );
}
