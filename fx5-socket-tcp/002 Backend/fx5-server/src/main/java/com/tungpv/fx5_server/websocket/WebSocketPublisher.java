package com.tungpv.fx5_server.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketPublisher {

    private static SimpMessagingTemplate staticTemplate;

    @Autowired
    public WebSocketPublisher(SimpMessagingTemplate template) {
        WebSocketPublisher.staticTemplate = template;
    }

    public static void broadcast(Object payload) {
        if (staticTemplate != null) {
            staticTemplate.convertAndSend("/topic/broadcastings", payload);
        } else {
            System.out.println("⚠️ WebSocketPublisher not initialized yet.");
        }
    }
}
