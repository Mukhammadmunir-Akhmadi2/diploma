package com.fosso.backend.fosso_backend.order.controller;

import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.order.dto.*;
import com.fosso.backend.fosso_backend.order.mapper.OrderMapper;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<String> placeOrder(@Valid @RequestBody CheckoutRequest checkoutRequest) {
        Order order = orderService.createOrder(checkoutRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(order.getOrderTrackingNumber());
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable String orderId, @RequestBody String notes) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(orderService.cancelOrder(orderId, notes));

    }

    @DeleteMapping("/{orderId}/product/{productId}")
    public ResponseEntity<String> cancelProduct(
            @PathVariable String orderId,
            @PathVariable String productId,
            @RequestBody String notes,
            @RequestParam String color,
            @RequestParam String size) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body( orderService.cancelProductFromOrder(orderId, productId, color, size, notes));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailedDTO> getOrderById(@PathVariable String orderId) {
        Order order = orderService.getOrder(orderId);
        return ResponseEntity.ok(OrderMapper.convertToDetailedDTO(order));
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<OrderBriefDTO> getOrderByTrackingNumber(@PathVariable String trackingNumber) {
        Order order = orderService.getByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(OrderMapper.convertToBriefDTO(order));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Map<String, Object>> getOrdersByCustomer(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Order> pageOrders = orderService.listByCustomer(customerId, pageable);

        List<OrderBriefDTO> orders = pageOrders.getContent().stream()
                .map(OrderMapper::convertToBriefDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageOrders, orders));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<OrderBriefDTO>> getOrdersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {

        List<Order> orders = orderService.findByDateRange(
                DateTimeUtils.toLocalDateTime(startDate),
                DateTimeUtils.toLocalDateTime(endDate));

        List<OrderBriefDTO> orderDTOs = orders.stream()
                .map(OrderMapper::convertToBriefDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }
}