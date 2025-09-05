package com.fosso.backend.fosso_backend.review.service.impl;

import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.common.exception.UnauthorizedException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import com.fosso.backend.fosso_backend.review.model.Review;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.review.repository.ReviewRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final AuthenticatedUserProvider userProvider;

    @Override
    @Loggable(action = "CREATE", entity = "Review", message = "Add a new review")
    public Review saveReview(Review review) {
        if (reviewRepository.existsByCustomerIdAndProductId(review.getCustomerId(), review.getProductId())) {
            throw new DuplicateResourceException("Review already exists for this product");
        }
        User currentUser = userProvider.getAuthenticatedUser();
        if (!currentUser.getUserId().equals(review.getCustomerId())) {
            throw new UnauthorizedException("You are not authorized to add a review for this product");
        }
        Product product = productService.getProductById(review.getProductId());

        review.setReviewId(UUID.randomUUID().toString());
        review.setReviewDateTime(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);

        List<Review> reviews = reviewRepository.findByProductId(product.getProductId());
        double averageRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        product.setRating(averageRating);
        product.setReviewCount(product.getReviewCount() + 1);
        productService.updateProduct(product);

        return savedReview;
    }

    @Override
    @Loggable(action = "UPDATE", entity = "Review", message = "Updated review")
    public String updateReview(String reviewId, Review review) {
        Review existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));

        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());
        reviewRepository.save(existingReview);

        return "Review updated successfully";
    }

    @Override
    public List<Review> getReviewsByCustomerId(String customerId) {
        List<Review> reviews = reviewRepository.findByCustomerId(customerId);
        if (reviews.isEmpty()) {
            throw new ResourceNotFoundException("Review not found with ID: " + customerId);
        }
        return reviews;
    }

    @Override
    public Page<Review> getReviewsByProductId(String productId, Pageable pageable) {
        if (!reviewRepository.existsByProductId(productId)) {
            throw new ResourceNotFoundException("Product not found with ID: " + productId);
        }
        return reviewRepository.findByProductId(productId, pageable);
    }

    @Override
    public Review getReviewByProductIdAndCustomerId(String productId, String customerId) {
        return reviewRepository.findByCustomerIdAndProductId(customerId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
    }
}
