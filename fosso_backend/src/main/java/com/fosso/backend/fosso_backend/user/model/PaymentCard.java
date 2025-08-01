package com.fosso.backend.fosso_backend.user.model;

import lombok.Data;

@Data
public class PaymentCard {
    private String cardId;
    private String cardNumber;
    private String cardHolderName;
    private String expirationDate;
    private String cardType;
    private boolean isDefault;
}