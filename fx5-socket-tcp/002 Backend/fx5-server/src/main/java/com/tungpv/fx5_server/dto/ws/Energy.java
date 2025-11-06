package com.tungpv.fx5_server.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Energy {
    private float current;
    private float voltage;
    private float powerConsumption;
    private float electricConsumption;
    private int status;
}
