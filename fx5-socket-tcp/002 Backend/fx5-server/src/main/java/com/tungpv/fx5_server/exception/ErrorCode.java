package com.tungpv.fx5_server.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public enum ErrorCode {
    SUCCESS(0, "Success.", HttpStatus.OK),
    LOGIN_SUCCESS(1, "Login successfully.", HttpStatus.OK),
    USER_REGISTERED(2, "User registered successfully.", HttpStatus.CREATED),
    REFRESH_SUCCESS(3, "Get refresh token successfully.", HttpStatus.OK),

    USER_EXISTED(20, "Username is already.", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(21, "Email is already.", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(22, "User not existed.", HttpStatus.NOT_FOUND),
    ROLE_NOT_EXISTED(23, "Role is not found.", HttpStatus.NOT_FOUND),

    UNEXPECTED_VALUE(40, "Unexpected value.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(41, "Password must be at least 8 characters.", HttpStatus.BAD_REQUEST),
    USERNAME_PASSWORD_INCORRECT(42, "Username or password incorrect.", HttpStatus.UNAUTHORIZED),
    INVALID_CREDENTIALS(43, "Invalid credentials.", HttpStatus.BAD_REQUEST),
    REFRESH_FAILED(44, "Refresh token invalid.", HttpStatus.UNAUTHORIZED),

    INVALID_KEY(98, "Invalid message key.", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(99, "Uncategorized exception.", HttpStatus.INTERNAL_SERVER_ERROR)
    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    private ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    public int getCode() {
        return code;
    }
    public String getMessage() {
        return message;
    }
    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}
