package com.tungpv.fx5_server.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WebSocketResponse {
    private int codeReturn;
    private String message;
    private Object data;
}
