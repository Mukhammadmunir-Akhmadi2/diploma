package com.fosso.backend.fosso_backend.common.handler;

import com.fosso.backend.fosso_backend.common.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {
        logger.warn("Authentication failed: {}", e.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(400, "Bad Request", "Invalid username/password supplied"));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException e) {
        logger.warn("Username not found: {}", e.getMessage());
        return ResponseEntity.status(404).body(new ErrorResponse(404, "Not Found", e.getMessage()));
    }
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        logger.warn("Validation failed: {}", ex.getErrors());
        String combinedErrors = String.join("; ", ex.getErrors());
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(400, "Bad Request", combinedErrors));
    }

    @ExceptionHandler(CartEmptyException.class)
    public ResponseEntity<ErrorResponse> handleCartEmptyException(CartEmptyException e) {
        logger.warn("Cart is empty: {}", e.getMessage());
        return ResponseEntity.status(400).body(new ErrorResponse(400, "Bad Request", e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        logger.warn("Resource not found: {}", e.getMessage());
        return ResponseEntity.status(404).body(new ErrorResponse(404, "Not Found", e.getMessage()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException e) {
        logger.warn("Duplicate resource: {}", e.getMessage());
        return ResponseEntity.status(409).body(new ErrorResponse(409, "Conflict", e.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException e) {
        logger.warn("Unauthorized access: {}", e.getMessage());
        return ResponseEntity.status(401).body(new ErrorResponse(401, "Unauthorized", e.getMessage()));
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.warn("Illegal argument: {}", e.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(400, "Bad Request", e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException e) {
        logger.warn("Illegal state: {}", e.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(400, "Bad Request", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(Exception e) {
        logger.error("Unexpected error occurred: ", e);
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal Server Error", "An unexpected error occurred"));
    }
}
