package com.tungpv.fx5_server.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class SignupRequest {
    private String fullname;
    private String username;
    @Size(min = 8, message = "INVALID_PASSWORD")
    private String password;
    private String email;
    private boolean status = true;
    private Set<String> roles;
}
