package com.fosso.backend.fosso_backend.order.dto;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import com.fosso.backend.fosso_backend.order.model.OrderDetail;
import com.fosso.backend.fosso_backend.user.model.Address;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrderDetailedDTO {
    private String orderId;
    private String orderTrackingNumber;
    private String customerId;
    private BigDecimal productsCost;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal total;
    private int deliveryDays;
    private LocalDate deliveryDate;
    private OrderStatus status;
    private Address shippingAddress;
    private List<OrderDetail> orderDetails = new ArrayList<>();
    private LocalDateTime orderDateTime;
}
