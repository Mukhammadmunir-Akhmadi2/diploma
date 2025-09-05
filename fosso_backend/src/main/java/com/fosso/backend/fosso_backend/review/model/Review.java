package com.fosso.backend.fosso_backend.review.model;
import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@CompoundIndex(name = "customer_product_idx", def = "{'productId': 1, 'customerId': 1}", unique = true)
public class Review implements LoggableEntity {
    @Id
    private String reviewId;
    @Indexed
    private String productId;
    private String productName;
    private String customerId;
    private String headline;
    private String comment;
    private int rating;
    private LocalDateTime reviewDateTime;

    @Override
    public String getEntityId() {
        return reviewId;
    }
}