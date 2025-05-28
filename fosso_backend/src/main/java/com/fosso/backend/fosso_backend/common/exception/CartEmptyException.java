package com.fosso.backend.fosso_backend.common.exception;

public class CartEmptyException extends RuntimeException {
    public CartEmptyException(String message) {
        super(message);
    }
}