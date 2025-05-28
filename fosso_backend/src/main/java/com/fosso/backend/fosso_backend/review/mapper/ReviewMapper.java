package com.fosso.backend.fosso_backend.review.mapper;

import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;
import com.fosso.backend.fosso_backend.review.dto.ReviewDTO;
import com.fosso.backend.fosso_backend.review.model.Review;

public class ReviewMapper {
    public static ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setProductId(review.getProductId());
        dto.setProductName(review.getProductName());
        dto.setCustomerId(review.getCustomerId());
        dto.setHeadline(review.getHeadline());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setReviewDateTime(DateTimeUtils.toString(review.getReviewDateTime()));
        return dto;
    }

    public static Review toEntity(ReviewDTO dto) {
        Review review = new Review();
        review.setReviewId(dto.getReviewId());
        review.setProductId(dto.getProductId());
        review.setProductName(dto.getProductName());
        review.setCustomerId(dto.getCustomerId());
        review.setHeadline(dto.getHeadline());
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setReviewDateTime(DateTimeUtils.toLocalDateTime(dto.getReviewDateTime()));
        return review;
    }
}
