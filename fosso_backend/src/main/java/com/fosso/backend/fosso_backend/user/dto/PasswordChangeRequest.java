package com.fosso.backend.fosso_backend.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String currentPassword;
    @NotEmpty(message = "Password cannot be empty")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,15}$",
            message = "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).")
    @Size(min = 6, max = 15, message = "Password must be between 6 and 15 characters")
    private String newPassword;
}