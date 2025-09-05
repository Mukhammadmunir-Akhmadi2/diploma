package com.fosso.backend.fosso_backend.user.model;

import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;

@Data
public class PaymentCard implements LoggableEntity {
    private String cardId;
    private String cardNumber;
    private String cardHolderName;
    private String expirationDate;
    private String cardType;
    private boolean isDefault;

    @Override
    public String getEntityId() {
        return cardId;
    }
}