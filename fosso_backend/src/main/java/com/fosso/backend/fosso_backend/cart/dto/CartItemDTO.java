package com.fosso.backend.fosso_backend.cart.dto;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private String cartId;
    private String customerId;
    private String productId;
    private String productName;
    private String productMainImgId;
    private String brandName;
    private String color;
    private String size;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String addedDateTime;
}