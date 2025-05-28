package com.fosso.backend.fosso_backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ProductVariantDTO {
    @NotEmpty(message = "Color is required")
    private String color;

    @NotEmpty(message = "Size is required")
    private String size;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private int stockQuantity;
}