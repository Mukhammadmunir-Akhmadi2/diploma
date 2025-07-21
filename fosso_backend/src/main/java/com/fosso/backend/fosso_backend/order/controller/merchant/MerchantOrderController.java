package com.fosso.backend.fosso_backend.order.controller.merchant;

import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.order.dto.OrderDetailedDTO;
import com.fosso.backend.fosso_backend.order.dto.OrderMerchantDTO;
import com.fosso.backend.fosso_backend.order.dto.OrderStatusUpdateRequest;
import com.fosso.backend.fosso_backend.order.mapper.OrderMapper;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/merchant/orders")
@RequiredArgsConstructor
public class MerchantOrderController {

    private final OrderService orderService;

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDetailedDTO> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody OrderStatusUpdateRequest statusUpdate) {

        Order updatedOrder = orderService.updateStatus(orderId, statusUpdate.getStatus(), statusUpdate.getNotes());
        return ResponseEntity.ok(OrderMapper.convertToDetailedDTO(updatedOrder));
    }

    @PutMapping("/{orderId}/product/{productId}/status")
    public ResponseEntity<OrderDetailedDTO> updateProductStatus(
            @PathVariable String orderId,
            @PathVariable String productId,
            @Valid @RequestBody OrderStatusUpdateRequest statusUpdate,
            @RequestParam String color,
            @RequestParam String size) {

        Order updatedOrder = orderService.updateProductStatus(orderId, productId, color, size, statusUpdate.getStatus(), statusUpdate.getNotes());
        return ResponseEntity.ok(OrderMapper.convertToDetailedDTO(updatedOrder));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getOrdersByMerchant(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<OrderMerchantDTO> pageOrders = orderService.listByMerchant(pageable);
        List<OrderMerchantDTO> orders = pageOrders.getContent();

        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageOrders, orders));
    }
}
