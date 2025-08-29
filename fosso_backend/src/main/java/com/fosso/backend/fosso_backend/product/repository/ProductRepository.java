package com.fosso.backend.fosso_backend.product.repository;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String>, ProductRepositoryCustom {
    //user
    @Query("{'$and': [{'enabled': true}, {'isDeleted': false}]}")
    Page<Product> findAllForUser(Pageable pageable);

    @Query("{'$and': [{'enabled': true}, {'isDeleted': false}, {'$text': {'$search': ?0}}]}")
    Page<Product> searchForUser(String keyword, Pageable pageable);

    //merchant
    @Query("{'merchantId': ?0, 'isDeleted': false}")
    Page<Product> findByMerchantIdAndDeletedNot(String merchantId, Pageable pageable);

    //admin
    @Query("{'merchantId': ?0}")
    Page<Product> findByMerchant(String merchantId, Pageable pageable);

    Page<Product> findByEnabledFalse(Pageable pageable);

    @Query("{'isDeleted': true}")
    Page<Product> findByIsDeletedTrue(Pageable pageable);


    @Query("{'$text': {'$search': ?0}}")
    Page<Product> findByKeyword(String keyword, Pageable pageable);
}