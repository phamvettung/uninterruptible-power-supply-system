import React, { useEffect, useState } from 'react'

export default function MiniatureCircuitBreaker({deviceName="", deviceId, deviceData}) {

  const [current, setCurrent] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [powerConsumption, setPower] = useState(0);
  const [electricConsumption, setElectric] = useState(0);
  const [isOn, setIsOn] = useState(false);


  useEffect(() => {
      if (!deviceData || Object.keys(deviceData).length === 0) return;

      if (deviceData.deviceId === deviceId) {
        const data = deviceData.data || {};
  
        setCurrent(data.current || 0);
        setVoltage(data.voltage || 0);
        setPower(data.powerConsumption || 0);
        setElectric(data.electricConsumption || 0);
        if (data.status !== undefined) {
          setIsOn(data.status === 0 ? false : true);
        }
      }
    }, [deviceData, deviceId]);


  return (
    <div className={"flex flex-col items-center justify-between gap-6 p-4 bg-transparent"} style={{width: "150px"}}>

      {/* Switch symbol */}
      <div style={{transform: "rotate(-90deg)"}}>
        <svg
            width="150"
            height="100"
            viewBox="0 0 200 100"
            className="cursor-pointer"
        >
          {/* Left wire */}
          <line
            x1="20"
            y1="50"
            x2="70"
            y2="50"
            stroke="gray"
            strokeWidth="4"
          />

          {/* Right wire */}
          <line
            x1="120"
            y1="50"
            x2="170"
            y2="50"
            stroke="gray"
            strokeWidth="4"
          />

          {/* Left contact */}
          <circle cx="70" cy="50" r="6" fill="transparent" stroke="gray" strokeWidth="3" />

          {/* Right contact */}
          <circle cx="120" cy="50" r="6" fill="transparent" stroke="gray" strokeWidth="3" />

          {/* Switch arm */}
          <line
            x1="70"
            y1="50"
            x2="120"
            y2="50"
            stroke="yellow"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              transformOrigin: "60px 50px",
              transform: isOn ? "rotate(0deg)" : "rotate(-30deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />

          {/* Arrow */}
          <line
            x1="35"
            y1="40"
            x2="15"
            y2="50"
            stroke="gray"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="35"
            y1="60"
            x2="15"
            y2="50"
            stroke="gray"
            strokeWidth="4"
            strokeLinecap="round"
          />

        </svg>      
      </div>
      <div className="border-1 border-black p-2 rounded-md w-32">
        <div className="border-b-2 border-black text-center font-bold">{deviceName}</div>
        <div className="mt-0.5 text-sm space-y-1">
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-6">
            {Math.round(current * 100) / 100} A
          </div>
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-6">
            {Math.round(voltage * 100) / 100} V
          </div>
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-6">
            {Math.round(powerConsumption * 100) / 100} kW
          </div>
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-6">
            {Math.round(electricConsumption * 100) / 100} kWh
          </div>
          <p>
            Status:{" "}
            <span className={`font-semibold ${isOn ? "text-green-600" : "text-red-600"}`}>
              {isOn ? "Close" : "Open"}
            </span>
          </p>
        </div>
      </div>
    </div> 
  )
}
