package com.fosso.backend.fosso_backend.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewDTO {
    private String reviewId;
    @NotNull(message = "product is required")
    private String productId;
    @NotNull(message = "product name is required")
    private String productName;
    @NotNull(message = "Customer is required")
    private String customerId;
    private String headline;
    @NotBlank(message = "Comment is required")
    private String comment;
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private int rating;
    private String reviewDateTime;
}
