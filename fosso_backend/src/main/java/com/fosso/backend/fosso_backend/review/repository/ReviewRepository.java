package com.fosso.backend.fosso_backend.review.repository;

import com.fosso.backend.fosso_backend.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> findByProductId(String productId, Pageable pageable);

    @Query("{'productId': ?0}")
    List<Review> findByProductId(String productId);

    List<Review> findByCustomerId(String customerId);

    boolean existsByCustomerIdAndProductId(String customerId, String productId);

    @Query("{'$and': [{'customerId': ?0}, {'productId': ?1}]}")
    Optional<Review> findByCustomerIdAndProductId(String customerId, String productId);

    boolean existsByProductId(String productId);
}