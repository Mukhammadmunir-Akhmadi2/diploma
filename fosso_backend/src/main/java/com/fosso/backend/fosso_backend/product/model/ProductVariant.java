package com.fosso.backend.fosso_backend.product.model;

import lombok.Data;

@Data
public class ProductVariant {
    private String color;
    private String size;
    private int stockQuantity;
}