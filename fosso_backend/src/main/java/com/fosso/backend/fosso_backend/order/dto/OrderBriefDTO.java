package com.fosso.backend.fosso_backend.order.dto;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OrderBriefDTO {
    private String orderId;
    private String orderTrackingNumber;
    private String customerId;
    private BigDecimal total;
    private int deliveryDays;
    private int items;
    private LocalDate deliveryDate;
    private OrderStatus orderStatus;
    private LocalDateTime orderDateTime;
}
