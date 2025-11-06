package com.tungpv.fx5_server.util;

import com.tungpv.fx5_server.dto.ws.DeviceCommand;
import com.tungpv.fx5_server.dto.ws.DeviceData;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

@Component
public class SocketUtil {

    public byte[] toBytes(DeviceCommand command) throws Exception {

        ByteBuffer buffer = ByteBuffer.allocate(10) // adjust total bytes as needed
                .order(ByteOrder.LITTLE_ENDIAN);
        buffer.put((byte) 0x02);
        buffer.put((byte) 0x00);
        buffer.putShort(command.getSequenceNumber());
        buffer.putShort(command.getDeviceId());
        buffer.putShort(command.getCommand());
        buffer.put((byte) 0x00);
        buffer.put((byte) 0x03);
        return buffer.array();
    }
}
