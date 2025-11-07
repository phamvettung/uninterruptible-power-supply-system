# UNINTERRUPTIBLE POWER SUPPLY SYSTEM

## Overview
This project is aimed at controlling and monitoring the status of cutting machines and circuit breakers. Collecting electrical data like current, voltage, load power consumption, etc.  

<div align="center">
    <img src="/assets/ups.png" width="960" height="540" alt="Final Result"/>
</div>

## Technology diagram
<div align="center">
    <img src="/assets/ups_diagram.png" width="960" height="540" alt="Final Result"/>
</div>
 - The Device connect to the Server using raw Socket TCP, message sent and received is a bytes array with 29 of length. Web browser connect to the Server using RESTful API and WebSocket, message sent and received is a JSON String.
 
## Technologies used
### Backend
- Spring Boot
- Spring Security
- MySQL
### Fontend
- ReactJS
### Device
- PLC Fx5UJ Mitsubishi
- MFM-300 Power Meter, etc
<div align="center">
    <img src="/assets/technologies-used.png" width="960" height="540" alt="Final Result"/>
</div>

## Demo
https://github.com/user-attachments/assets/bb3c1437-af67-440f-a936-d1a52ee4f34f
