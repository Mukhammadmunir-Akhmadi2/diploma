package com.fosso.backend.fosso_backend.order.model;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import com.fosso.backend.fosso_backend.common.enums.PaymentMethod;
import com.fosso.backend.fosso_backend.user.model.Address;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String orderId;
    @Indexed
    private String orderTrackingNumber;
    private String customerId;
    private BigDecimal productsCost;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal shippingCost = BigDecimal.ZERO;
    private BigDecimal total = BigDecimal.ZERO;
    private BigDecimal tax = BigDecimal.ZERO;
    private PaymentMethod paymentMethod;
    private LocalDateTime orderDateTime;
    private int deliveryDays;
    private LocalDate deliveryDate;
    private Address shippingAddress;
    private OrderStatus status;
    private List<OrderDetail> orderDetails = new ArrayList<>();
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
}