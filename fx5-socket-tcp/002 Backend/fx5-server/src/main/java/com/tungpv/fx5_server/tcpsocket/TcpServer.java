package com.tungpv.fx5_server.tcpsocket;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TcpServer {
    private ServerSocket serverSocket;
    private final Map<String, ClientHandler> clients = new ConcurrentHashMap<>();
    private volatile boolean running = true;

    @PostConstruct
    public void start(){
        new Thread(this::runServer, "TCP-Server-Main").start();
    }

    private void runServer() {
        try{
            serverSocket = new ServerSocket(4096);
            System.out.println("✅ TCP Server started on port 4096");

            while (running){
                Socket socket = serverSocket.accept();
                String clientId = socket.getRemoteSocketAddress().toString();

                ClientHandler handler = new ClientHandler(clientId, socket);
                clients.put(clientId, handler);

                new Thread(handler, "TCP-Client-" + clientId).start();
                System.out.println("New client connected: " + clientId);

            }
        } catch (Exception e){
            if (running) {
                e.printStackTrace();
            }
        }
    }

    public void sendToClient(String clientId, String message) {
        ClientHandler handler = clients.get(clientId);
        if (handler != null) {
            handler.sendMessage(message);
        }
    }

    public void broadcastMsgBytes(byte[] msg) {
        clients.values().forEach(client -> {
            try {
                client.sendMessageBytes(msg);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public void broadcast(String message) {
        clients.values().forEach(client -> client.sendMessage(message));
    }

    @PreDestroy
    public void stop() {
        running = false;
        try {
            serverSocket.close();
        } catch (Exception ignored) {}
        clients.values().forEach(ClientHandler::close);
        System.out.println("🛑 TCP Server stopped.");
    }

}
