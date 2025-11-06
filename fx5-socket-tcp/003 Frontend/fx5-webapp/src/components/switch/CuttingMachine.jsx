import React, { useEffect, useState } from 'react'
import { connectWebSocket, sendMessage } from '../../ws';

export default function CuttingMachine({isHorizontal, deviceId, deviceName, deviceData}) {

  const [current, setCurrent] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [powerConsumption, setPower] = useState(0);
  const [electricConsumption, setElectric] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = (state) => {
      setIsOn(state);
  };


  useEffect(() => {
    if (!deviceData || Object.keys(deviceData).length === 0) return;

    //console.log("📩 Device Data updated in CuttingMachine:", deviceData);

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

  const handleSend = (id, cmd) => {
    const deviceCommand = {
      sequenceNumber: 0,
      deviceId: id,
      command: cmd,
    };
    sendMessage("/app/device-command", deviceCommand);
  }

  return (
    <div className={`flex items-center gap-5 p-4 bg-transparent ${isHorizontal===1? "flex-col" : ""}`}
      style={{
        position: 'absolute',
        width: "310px"
      }}
    >

      {/* Switch symbol */}
      <div style={{transform: isHorizontal===1? "" : "rotate(-90deg)", position: 'relative', zIndex: 0, pointerEvents: "auto",}} >
        <svg
          width= {isHorizontal===1? "200" : "150"}
          height= {isHorizontal===1? "65" : "200"}
          viewBox="0 0 200 80"
          onClick={() => setIsOn(!isOn)}
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
          { isHorizontal === 0 && (
              <>
                  <line
                  x1="185"
                  y1="40"
                  x2="166"
                  y2="50"
                  stroke="gray"
                  strokeWidth="4"
                  strokeLinecap="round"
                  />
                  <line
                    x1="185"
                    y1="60"
                    x2="166"
                    y2="50"
                    stroke="gray"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
              </>
            )
          }         
        </svg>      
      </div>

      {/* Control Panel */}
      <div className="border-1 border-black p-2 rounded-md w-30" style={{position: "relative", zIndex: 10, }}>
        <div className="border-b-2 border-black text-center font-bold">{deviceName}</div>
        <div className="mt-0.5 text-sm space-y-1"> 
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-8 text-lg">
            {Math.round(current * 100) / 100} A
          </div>
          <div className="w-full text-center font-mono text-blue-300 bg-black border-2 border-blue-800 rounded-md p-0 select-none h-8 text-lg">
            {Math.round(voltage * 100) / 100} V
          </div>
          <p>
            Status:{" "}
            <span className={`font-semibold ${isOn ? "text-green-600" : "text-red-600"}`}>
              {isOn ? "Close" : "Open"}
            </span>
          </p>
        </div>
        <div className="flex justify-around mt-1">
          <button
            className="border border-black px-2 py-1 rounded hover:bg-gray-200"
            onClick={() => handleSend(deviceId, 1)}
          >
            Close
          </button>
          <button
            className="border border-black px-2 py-1 rounded hover:bg-gray-200"
            onClick={() => handleSend(deviceId, 0)}
          >
            Open
          </button>
        </div>
      </div>
    </div> 
  )
}

