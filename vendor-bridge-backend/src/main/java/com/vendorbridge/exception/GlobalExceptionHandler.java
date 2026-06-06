package com.vendorbridge.exception;

import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> notFound(ResourceNotFoundException ex) { return body(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage()); }
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> forbidden(UnauthorizedException ex) { return body(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage()); }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> bad(BusinessException ex) { return body(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage()); }
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<Map<String, Object>> validation(Exception ex) {
        if (ex instanceof MethodArgumentNotValidException manv) {
            List<String> messages = manv.getBindingResult().getFieldErrors().stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).toList();
            return ResponseEntity.badRequest().body(Map.of("error", "Validation Failed", "messages", messages, "status", 400, "timestamp", LocalDateTime.now().toString()));
        }
        return body(HttpStatus.BAD_REQUEST, "Validation Failed", ex.getMessage());
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> any(Exception ex) { return body(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "An unexpected error occurred"); }
    private ResponseEntity<Map<String, Object>> body(HttpStatus status, String error, String message) {
        return ResponseEntity.status(status).body(Map.of("error", error, "message", message, "status", status.value(), "timestamp", LocalDateTime.now().toString()));
    }
}
