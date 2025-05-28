package com.fosso.backend.fosso_backend.order.dto;
import com.fosso.backend.fosso_backend.common.enums.OrderStatus;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private OrderStatus status;

    @NotEmpty(message = "Notes cannot be empty")
    private String notes;
}