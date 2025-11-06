package com.tungpv.fx5_server.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeviceCommand {
    private short sequenceNumber;
    private short deviceId;
    private short command;
}
