package com.fosso.backend.fosso_backend.user.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateDTO {

    private String userId;
    @NotEmpty(message = "first Name cannot be empty")
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name should contain only letters")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String firstName;

    @NotEmpty(message = "last Name cannot be empty")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name should contain only letters")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phoneNumber;

    private Boolean isPhoneNumberPrivate;
    private Gender gender;
    private Boolean isGenderPrivate
            ;
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date of birth should be in the format yyyy-MM-dd")
    private String dateOfBirth;
    private Boolean isDateOfBirthPrivate;
}