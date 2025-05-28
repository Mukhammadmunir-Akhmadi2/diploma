package com.fosso.backend.fosso_backend.order.mapper;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.order.dto.OrderBriefDTO;
import com.fosso.backend.fosso_backend.order.dto.OrderDetailedDTO;
import com.fosso.backend.fosso_backend.order.dto.OrderMerchantDTO;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.model.OrderDetail;

public class OrderMapper {
    public static OrderDetailedDTO convertToDetailedDTO(Order order) {
        OrderDetailedDTO dto = new OrderDetailedDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderTrackingNumber(order.getOrderTrackingNumber());
        dto.setCustomerId(order.getCustomerId());
        dto.setProductsCost(order.getProductsCost());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCost(order.getShippingCost());
        dto.setTotal(order.getTotal());
        dto.setDeliveryDays(order.getDeliveryDays());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setOrderDetails(order.getOrderDetails());
        dto.setOrderDateTime(order.getOrderDateTime());
        return dto;
    }

    public static OrderBriefDTO convertToBriefDTO(Order order) {
        OrderBriefDTO dto = new OrderBriefDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderTrackingNumber(order.getOrderTrackingNumber());
        dto.setCustomerId(order.getCustomerId());
        dto.setTotal(order.getTotal());
        dto.setItems(order.getOrderDetails().size());
        dto.setDeliveryDays(order.getDeliveryDays());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setOrderStatus(order.getStatus());
        dto.setOrderDateTime(order.getOrderDateTime());
        return dto;
    }

    public static OrderMerchantDTO convertToMerchantDTO(Order order, OrderDetail orderDetail, ImageDTO imageDTO) {
        OrderMerchantDTO dto = new OrderMerchantDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderTrackingNumber(order.getOrderTrackingNumber());
        dto.setCustomerId(order.getCustomerId());
        dto.setMerchantId(orderDetail.getMerchantId());
        dto.setProductId(orderDetail.getProductId());
        dto.setProductName(orderDetail.getProductName());
        dto.setProductImage(imageDTO);
        dto.setQuantity(orderDetail.getQuantity());
        dto.setColor(orderDetail.getColor());
        dto.setSize(orderDetail.getSize());
        dto.setPrice(orderDetail.getPrice());
        dto.setSubtotal(orderDetail.getSubtotal());
        dto.setShippingCost(orderDetail.getShippingCost());
        dto.setOrderTrack(orderDetail.getOrderTrack());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setOrderDateTime(order.getOrderDateTime());
        dto.setDeliveryDays(order.getDeliveryDays());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setShippingAddress(order.getShippingAddress());
        return dto;
    }
}
