package com.fosso.backend.fosso_backend.cart.model;

import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "cart_items")
@CompoundIndex(name = "customer_product_variant_idx",
        def = "{'customerId': 1, 'productId': 1, 'color': 1, 'size': 1}",
        unique = true)
public class CartItem implements LoggableEntity {
    @Id
    private String cartId;
    private String customerId;
    private String productId;
    private String color;
    private String size;
    private int quantity;
    private LocalDateTime addedDateTime;

    @Override
    public String getEntityId() {
        return cartId;
    }
}