package com.fosso.backend.fosso_backend.common.utils;

import com.fosso.backend.fosso_backend.common.exception.ValidationException;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.stream.Collectors;

public class ValidationUtils {
    private ValidationUtils() {
    }

    public static void validate(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                    .collect(Collectors.toList());

            throw new ValidationException(errors);
        }
    }
}
