package com.fosso.backend.fosso_backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotEmpty(message = "first Name cannot be empty")
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name should contain only letters")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String firstName;

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name should contain only letters")
    private String lastName;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotEmpty(message = "Password cannot be empty")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,15}$",
            message = "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).")
    @Size(min = 6, max = 15, message = "Password must be between 6 and 15 characters")
    private String password;
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phoneNumber;
}