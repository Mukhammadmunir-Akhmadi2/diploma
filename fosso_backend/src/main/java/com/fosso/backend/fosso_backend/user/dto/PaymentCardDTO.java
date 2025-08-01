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
public class PaymentCardDTO {

    private String cardId;

    @NotNull(message = "Card number is required")
    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Card number must be between 13 and 19 digits")
    private String cardNumber;

    @NotNull(message = "Cardholder name is required")
    @NotBlank(message = "Cardholder name is required")
    @Size(max = 100, message = "Cardholder name must be less than 100 characters")
    private String cardHolderName;

    @NotNull(message = "Expiration date is required")
    @NotBlank(message = "Expiration date is required")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/(\\d{2})$", message = "Expiration date must be in MM/YY format")
    private String expirationDate;

    @NotNull(message = "Card type is required")
    @NotBlank(message = "Card type is required")
    @Size(max = 50, message = "Card type must be less than 50 characters")
    private String cardType;

    private Boolean isDefault = false;
}