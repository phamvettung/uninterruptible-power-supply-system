import React from 'react'

export default function Busbar() {
  return (
    <div className="bg-transparent" style={{
        position: 'absolute',
    }}>
        <svg
          width="500"
          height="100"
          viewBox="0 0 700 100"
          className="cursor-pointer"
        >
            <line
                x1="0"
                y1="0"
                x2="800"
                y2="0"
                stroke="gray"
                strokeWidth="10"
                strokeLinecap="round"
            />
        </svg>
    </div>
  )
}
