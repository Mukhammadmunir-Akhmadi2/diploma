package com.fosso.backend.fosso_backend.order.service;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import com.fosso.backend.fosso_backend.common.enums.PaymentMethod;
import com.fosso.backend.fosso_backend.order.dto.CheckoutRequest;
import com.fosso.backend.fosso_backend.order.dto.OrderMerchantDTO;
import com.fosso.backend.fosso_backend.order.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    List<Order> listAll();
    Page<Order> listByPage(String keyword, Pageable pageable);
    Order getOrder(String orderId);
    Order getByTrackingNumber(String trackingNumber);
    Page<Order> listByCustomer(String customerId, Pageable pageable);
    Page<Order> listByStatus(OrderStatus status, Pageable pageable);
    Order createOrder(CheckoutRequest checkoutRequest);
    Order updateStatus(String orderId, OrderStatus status, String notes);
    Order updateProductStatus(String orderId, String productId, String color, String size, OrderStatus status, String notes);
    String cancelOrder(String orderId, String notes);
    List<Order> findByDateRange(LocalDateTime  startDate, LocalDateTime endDate);
    String cancelProductFromOrder(String orderId, String productId, String color, String size, String notes);
    Page<OrderMerchantDTO> listByMerchant(Pageable pageable);
}
