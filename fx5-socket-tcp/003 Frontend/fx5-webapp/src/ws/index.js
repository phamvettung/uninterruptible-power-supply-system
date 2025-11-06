import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


const SOCKET_URL = "http://localhost:8080/fx5-server/ws";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  stompClient = new Client({
    brokerURL: SOCKET_URL, // native WebSocket connection
    reconnectDelay: 5000,
    debug: (debugMsg) => console.log("Debug: ", debugMsg),
    onConnect: (frame) => {
      console.log("✅ Connected: ", frame);

      // Subscribe to topic from backend
      stompClient.subscribe("/topic/greetings", (message) => {
        const body = JSON.parse(message.body);
        console.log("📩 Message received:", body);
        if (onMessageReceived) onMessageReceived(body);
      });

      stompClient.subscribe("/topic/cutting-machines", (message) => {
        const body = JSON.parse(message.body);
        console.log("📩 Message received:", body);
        if (onMessageReceived) {
          onMessageReceived(body);
        }
      });

      stompClient.subscribe("/topic/broadcastings", (message) => {
        const body = JSON.parse(message.body);
        console.log("📩 Message received:", body);
        if (onMessageReceived) onMessageReceived(body);
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP Error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const sendMessage = (dst, msg) => {
    if(stompClient && stompClient.connected){
        const message = {msg};
        stompClient.publish({
            destination: dst,
            body: JSON.stringify(msg),
        });
        console.log("📤 Sent to server:", msg);
    } else {
      console.warn("⚠️ stompClient not connected");
    }
}