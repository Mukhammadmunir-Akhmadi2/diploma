package com.fosso.backend.fosso_backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private String addressId;

    @NotNull(message = "Address type is required")
    @NotBlank(message = "Address type is required")
    private String addressType;

    @NotNull(message = "Phone number is required")
    @NotBlank(message = "Phone number  is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
    private String phoneNumber;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 100, message = "Address line 1 must be less than 100 characters")
    private String addressLine1;

    @Size(max = 100, message = "Address line 2 must be less than 100 characters")
    private String addressLine2;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must be less than 50 characters")
    private String city;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "State must be less than 50 characters")
    private String state;

    @NotBlank(message = "Postal code is required")
    @Size(max = 20, message = "Postal code must be less than 20 characters")
    private String postalCode;

    private Boolean isDefault = false;

    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country must be less than 50 characters")
    private String country;
}