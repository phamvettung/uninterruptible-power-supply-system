import React, { useState, useEffect } from "react";
import CuttingMachine from "../../components/switch/CuttingMachine";
import MiniatureCircuitBreaker from "../../components/switch/MiniatureCircuitBreaker";
import Busbar from "../../components/wire/Busbar";
import Wire from "../../components/wire/Wire";
import { connectWebSocket, sendMessage } from "../../ws";
import { Button } from "antd";
import ControlPanel from "../../components/panel/ControlPanel";

export default function Main() {

  const [deviceDt, setDeviceData] = useState({});

   useEffect(() => {
    connectWebSocket((body) => {
      //console.log("Body ", body);
      if (body.messageType === "DVDT" && body.deviceId) {
        setDeviceData((prev) => ({
          ...prev,
          ...body,
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(deviceDt).length > 0) {
      //console.log("DeviceData updated:", deviceDt);
    }
  }, [deviceDt]);

  //=== hello world
  const [name, setName] = useState("");
  const handleSend = () => {
    setName("Tung");
    if (name.trim() !== "") sendMessage("/app/hello", name);
  }
  //===

  return (
    <>
      <svg className="w-full h-full border border-gray-400" >

        <Wire x1={560} y1={170} x2={1070} y2={170} color="gray" thickness={2} dashline={2.5}/>
        <Wire x1={820} y1={170} x2={820} y2={340} color="gray" thickness={2} dashline={2.5}/>

        <foreignObject x="450" y="50" width="320" height="220">
          <CuttingMachine isHorizontal={0} deviceName="QF1" deviceId={1} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="1000" y="50" width="320" height="220">
          <CuttingMachine isHorizontal={0} deviceName="QF2" deviceId={2} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="668" y="309" width="220" height="320">
          <CuttingMachine isHorizontal={1} deviceName="QF3" deviceId={3} deviceData={deviceDt}/>
        </foreignObject>

        <foreignObject x="100" y="352" width="700" height="30">
          <Busbar/>
        </foreignObject>
        <foreignObject x="1050" y="352" width="700" height="30">
          <Busbar/>
        </foreignObject>

        <foreignObject x="50" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF1" deviceId={4} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="200" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF2" deviceId={5} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="350" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF3" deviceId={6} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="500" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF4" deviceId={7} deviceData={deviceDt}/>
        </foreignObject>

        <foreignObject x="1000" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF5" deviceId={8} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="1150" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF6" deviceId={9} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="1300" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF7" deviceId={10} deviceData={deviceDt}/>
        </foreignObject>
        <foreignObject x="1450" y="355" width="150" height="400">
          <MiniatureCircuitBreaker deviceName="SF8" deviceId={11} deviceData={deviceDt}/>
        </foreignObject>   


        <Wire x1={548} y1={225} x2={548} y2={363} color="gray" thickness={3} />
        <Wire x1={1098} y1={225} x2={1098} y2={363} color="gray" thickness={3} />
        <Wire x1={760} y1={366} x2={600} y2={366} color="gray" thickness={3} />
        <Wire x1={1050} y1={366} x2={880} y2={366} color="gray" thickness={3} />

        <foreignObject x="470" y="130" width="50" height="80">
          <div className="flex flex-col">
            <span>MCCB 3P</span>
            <span>100A</span>
            <span>50kA</span>
          </div>
        </foreignObject>
        <foreignObject x="1020" y="130" width="50" height="80">
          <div className="flex flex-col">
            <span>MCCB 3P</span>
            <span>100A</span>
            <span>50kA</span>
          </div>
        </foreignObject>
        <foreignObject x="750" y="270" width="50" height="80">
          <div className="flex flex-col">
            <span>MCCB 3P</span>
            <span>100A</span>
            <span>50kA</span>
          </div>
        </foreignObject>



        <foreignObject x="50" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>20A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="200" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>20A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="350" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>16A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="500" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>16A</span>
            <span>6kA</span>
          </div>
        </foreignObject>

        <foreignObject x="1000" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>20A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="1150" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>20A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="1300" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>16A</span>
            <span>6kA</span>
          </div>
        </foreignObject>
        <foreignObject x="1450" y="385" width="50" height="80">
          <div className="flex flex-col">
            <span>MCB 2P</span>
            <span>16A</span>
            <span>6kA</span>
          </div>
        </foreignObject>

        <foreignObject x="500" y="40" width="100" height="40">
          <div style={{
            width: '100px',
            height: '40px',
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>
            BRA 01
          </div>
        </foreignObject>

        <foreignObject x="1050" y="40" width="100" height="40">
          <div style={{
            width: '100px',
            height: '40px',
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>
            BRA 02
          </div>
        </foreignObject>
      </svg>



    </>
  )
}
