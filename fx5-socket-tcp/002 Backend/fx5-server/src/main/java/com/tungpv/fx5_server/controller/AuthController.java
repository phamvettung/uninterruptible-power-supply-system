package com.tungpv.fx5_server.controller;

import com.tungpv.fx5_server.dto.request.LoginRequest;
import com.tungpv.fx5_server.dto.request.RefreshRequest;
import com.tungpv.fx5_server.dto.request.SignupRequest;
import com.tungpv.fx5_server.dto.response.JwtResponse;
import com.tungpv.fx5_server.dto.response.MessageResponse;
import com.tungpv.fx5_server.entity.ERole;
import com.tungpv.fx5_server.entity.Role;
import com.tungpv.fx5_server.entity.Users;
import com.tungpv.fx5_server.exception.CustomException;
import com.tungpv.fx5_server.exception.ErrorCode;
import com.tungpv.fx5_server.security.CustomUserDetails;
import com.tungpv.fx5_server.service.RoleService;
import com.tungpv.fx5_server.service.UserService;
import com.tungpv.fx5_server.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/v1/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/refresh")
    public ResponseEntity<MessageResponse> refresh (@RequestBody RefreshRequest request){

        String username = jwtUtil.extractUsername(request.getRefreshToken());
        if (jwtUtil.isTokenValid2(request.getRefreshToken(), username)){
            String newAccessToken = jwtUtil.generateAccessToken(username);

            JwtResponse authorization = new JwtResponse(newAccessToken, request.getRefreshToken(), jwtUtil.getACCESS_TOKEN_EXPIRATION(), "Bearer ");
            ErrorCode errorCode = ErrorCode.REFRESH_SUCCESS;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , authorization));
        }
        ErrorCode errorCode = ErrorCode.REFRESH_FAILED;
        return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , null));
    }

    @PostMapping("/login")
    public ResponseEntity<MessageResponse> login (@RequestBody LoginRequest loginRequest, HttpServletResponse response){

        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword() ));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String accessToken = jwtUtil.generateAccessToken(userDetails.getUsername());
            String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername());

            JwtResponse authorization = new JwtResponse(accessToken, refreshToken, jwtUtil.getACCESS_TOKEN_EXPIRATION(), "Bearer ");
            ErrorCode errorCode = ErrorCode.LOGIN_SUCCESS;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() , authorization));

        } catch (UsernameNotFoundException | BadCredentialsException e){
            ErrorCode errorCode = ErrorCode.USERNAME_PASSWORD_INCORRECT;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage() ,e.getMessage()));
        } catch (AuthenticationException e){
            ErrorCode errorCode = ErrorCode.INVALID_CREDENTIALS;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage(), e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> register(@RequestBody @Valid SignupRequest signupRequest){

        if (userService.exitsByUsername(signupRequest.getUsername())) {
            ErrorCode errorCode = ErrorCode.USER_EXISTED;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage(), null));
        }
        if (userService.exitsByEmail(signupRequest.getEmail())) {
            ErrorCode errorCode = ErrorCode.EMAIL_EXISTED;
            return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage(), null));
        }

        Users users = new Users();
        users.setFullname(signupRequest.getFullname());
        users.setUsername(signupRequest.getUsername());
        users.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        users.setEmail(signupRequest.getEmail());
        users.setStatus(signupRequest.isStatus());
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<Role>();
        if(strRoles == null){
            //default role user
            Role userRole = roleService.findByRoleName(ERole.ROLE_USER).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_EXISTED));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin": {
                        Role adminRole = roleService.findByRoleName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_EXISTED));
                        roles.add(adminRole);
                        break;
                    }
                    case "moderator": {
                        Role modRole = roleService.findByRoleName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_EXISTED));
                        roles.add(modRole);
                        break;
                    }
                    case "user": {
                        Role userRole = roleService.findByRoleName(ERole.ROLE_USER)
                                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_EXISTED));
                        roles.add(userRole);
                        break;
                    }
                    default:
                        throw new IllegalArgumentException("Unexpected value: " + role);
                }
            });
        }
        users.setRoles(roles);
        userService.saveOrUpdate(users);
        ErrorCode errorCode = ErrorCode.USER_REGISTERED;
        return ResponseEntity.status(errorCode.getStatusCode()).body(new MessageResponse(errorCode.getCode(), errorCode.getMessage(), users));
    }

}
