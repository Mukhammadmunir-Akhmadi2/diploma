package com.fosso.backend.fosso_backend.review.controller;

import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import com.fosso.backend.fosso_backend.review.dto.ReviewDTO;
import com.fosso.backend.fosso_backend.review.mapper.ReviewMapper;
import com.fosso.backend.fosso_backend.review.model.Review;
import com.fosso.backend.fosso_backend.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        reviewService.saveReview(ReviewMapper.toEntity(reviewDTO));
        return ResponseEntity.ok("Review created successfully");
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable String reviewId, @Valid @RequestBody ReviewDTO reviewDTO, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        String response = reviewService.updateReview(reviewId, ReviewMapper.toEntity(reviewDTO));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByCustomerId(@PathVariable String customerId) {
        List<Review> reviews = reviewService.getReviewsByCustomerId(customerId);
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewDTOs);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getReviewsByProductId(
            @PathVariable String productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDateTime,asc") String[] sort) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Review> reviews = reviewService.getReviewsByProductId(productId, pageable);
        List<ReviewDTO> reviewDTOs = reviews.getContent().stream().map(ReviewMapper::toDTO).toList();
        return ResponseEntity.ok(PaginationUtil.buildPageResponse(reviews, reviewDTOs));
    }


    @GetMapping("/product/{productId}/customer/{customerId}")
    public ResponseEntity<ReviewDTO> getReviewByProductIdAndCustomerId(@PathVariable String productId, @PathVariable String customerId) {
        Review review = reviewService.getReviewByProductIdAndCustomerId(productId, customerId);
        return ResponseEntity.ok(ReviewMapper.toDTO(review));
    }
}