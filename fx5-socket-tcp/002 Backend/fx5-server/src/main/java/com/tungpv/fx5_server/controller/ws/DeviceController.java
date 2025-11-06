package com.tungpv.fx5_server.controller.ws;

import com.tungpv.fx5_server.dto.ws.DeviceCommand;
import com.tungpv.fx5_server.dto.ws.DeviceData;
import com.tungpv.fx5_server.dto.ws.WebSocketResponse;
import com.tungpv.fx5_server.tcpsocket.TcpServer;
import com.tungpv.fx5_server.util.SocketUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DeviceController {

    @Autowired
    private SocketUtil socketUtil;

    @Autowired
    private TcpServer tcpServer;

    @MessageMapping("/device-command")
    @SendTo("/topic/cutting-machines")
    public WebSocketResponse modify(DeviceCommand deviceCommand) throws Exception {
        byte[] messageBytes = socketUtil.toBytes(deviceCommand);
        tcpServer.broadcastMsgBytes(messageBytes);
        return new WebSocketResponse(0, "Command succes.", deviceCommand);
    }
}
