package com.fosso.backend.fosso_backend.product.repository;

import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String>, ProductRepositoryCustom {
    //user

    //merchant
    Page<Product> findByMerchantIdAndIsDeletedFalse(String merchantId, Pageable pageable);

    //admin
    Page<Product> findByMerchantId(String merchantId, Pageable pageable);

    Page<Product> findByEnabledFalse(Pageable pageable);

    Page<Product> findByIsDeletedTrue(Pageable pageable);

    @Query("{'$text': {'$search': ?0}}")
    Page<Product> findByKeyword(String keyword, Pageable pageable);
}