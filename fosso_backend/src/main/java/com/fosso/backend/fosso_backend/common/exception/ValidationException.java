package com.fosso.backend.fosso_backend.common.exception;

import java.util.List;

public class ValidationException extends RuntimeException {
    private final List<String> errors;

    public ValidationException(List<String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
