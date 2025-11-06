package com.tungpv.fx5_server.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeviceData {
    private String messageType;
    private short deviceId;
    private short sequenceNumber;
    private Object data;
}
