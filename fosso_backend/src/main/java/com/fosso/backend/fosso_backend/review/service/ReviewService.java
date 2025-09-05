package com.fosso.backend.fosso_backend.review.service;

import com.fosso.backend.fosso_backend.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    Review saveReview(Review review);
    String updateReview(String reviewId, Review review);
    List<Review> getReviewsByCustomerId(String customerId);
    Page<Review> getReviewsByProductId(String productId, Pageable pageable);
    Review getReviewByProductIdAndCustomerId(String productId, String customerId);
}
