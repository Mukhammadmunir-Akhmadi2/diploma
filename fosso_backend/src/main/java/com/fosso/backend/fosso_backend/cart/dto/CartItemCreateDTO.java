package com.fosso.backend.fosso_backend.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemCreateDTO {
    @NotNull(message = "Product ID is required")
    private String productId;
    @NotNull(message = "Size is required")
    private String size;
    @NotNull(message = "Color is required")
    private String color;
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
