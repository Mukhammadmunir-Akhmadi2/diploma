package com.fosso.backend.fosso_backend.order.model;

import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OrderTrack {
    private LocalDate updatedTime;
    private OrderStatus status;
    private String notes;
}
