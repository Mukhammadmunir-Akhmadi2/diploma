package com.fosso.backend.fosso_backend.order.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderDetail {
    private String merchantId;
    private String productId;
    private String productName;
    private int quantity;
    private String color;
    private String size;
    private BigDecimal price;
    private BigDecimal shippingCost;
    private BigDecimal subtotal;
    private OrderTrack orderTrack;
}
