import React from 'react'

export default function Tank({ level }) {
  const fillHeight = `${level}%`;
  return (
    <div className="relative w-16 h-48 border-4 border-sky-400 rounded-b-lg overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-full bg-sky-400 transition-all duration-500"
        style={{ height: fillHeight }}
      />
      <div className="absolute top-1 left-1 text-xs bg-black bg-opacity-40 px-1 rounded">
        {level}%
      </div>
    </div>
  )
}
