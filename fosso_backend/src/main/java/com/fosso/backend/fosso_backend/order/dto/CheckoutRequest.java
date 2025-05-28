package com.fosso.backend.fosso_backend.order.dto;

import com.fosso.backend.fosso_backend.common.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotNull(message = "Address id is required")
    @NotEmpty(message = "Address id cannot be empty")
    private String addressId;
    @NotNull(message = "Payment Method is required")
    private PaymentMethod paymentMethod;
}
