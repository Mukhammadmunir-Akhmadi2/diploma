package com.fosso.backend.fosso_backend.order.dto;

import com.fosso.backend.fosso_backend.common.enums.PaymentMethod;
import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.order.model.OrderTrack;
import com.fosso.backend.fosso_backend.user.model.Address;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OrderMerchantDTO {
    private String orderId;
    private String orderTrackingNumber;
    private String customerId;
    private String merchantId;
    private String productId;
    private String productName;
    private int quantity;
    private String color;
    private String size;
    private BigDecimal price;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal shippingCost = BigDecimal.ZERO;
    private OrderTrack orderTrack;
    private PaymentMethod paymentMethod;
    private LocalDateTime orderDateTime;
    private int deliveryDays;
    private LocalDate deliveryDate;
    private Address shippingAddress;
}
