package com.tungpv.fx5_server.controller;

import com.tungpv.fx5_server.dto.response.MessageResponse;
import com.tungpv.fx5_server.entity.Users;
import com.tungpv.fx5_server.exception.ErrorCode;
import com.tungpv.fx5_server.service.UserService;
import com.tungpv.fx5_server.tcpsocket.TcpServer;
import com.tungpv.fx5_server.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/v1/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<MessageResponse> getAllUser(){
        List<Users> users = userService.getAll();
        ErrorCode errorCode = ErrorCode.SUCCESS;
        return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , users));
    }

    @GetMapping("/info")
    public ResponseEntity<MessageResponse> getUserInfo(@RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        Users user = userService.findByUsername(username);
        if(user != null){
            ErrorCode errorCode = ErrorCode.SUCCESS;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , user));
        } else {
            ErrorCode errorCode = ErrorCode.USER_NOT_EXISTED;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , null));
        }
    }

}
