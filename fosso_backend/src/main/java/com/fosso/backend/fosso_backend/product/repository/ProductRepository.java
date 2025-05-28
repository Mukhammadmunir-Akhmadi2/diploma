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
public interface ProductRepository extends MongoRepository<Product, String> {
    //user
    @Query("{'$and': [{'enabled': true}, {'isDeleted': false}]}")
    Page<Product> findAllForUser(Pageable pageable);

    @Query("{'$and': [{'enabled': true}, {'isDeleted': false}, {'$text': {'$search': ?0}}]}")
    Page<Product> searchForUser(String keyword, Pageable pageable);

    @Query("{'$and': [{'categoryId': ?0}, {'enabled': true}, {'isDeleted': false}]}")
    Page<Product> findByCategoryIdForUser(String categoryId, Pageable pageable);

    @Query("{'$and': [{'brandId': ?0}, {'enabled': true}, {'isDeleted': false}]}")
    Page<Product> findByBrandIdForUser(String brandId, Pageable pageable);

    @Query("{'$and': [{'categoryId': {'$in': ?0}}, {'brandId': ?1}, {'enabled': true}, {'isDeleted': false}]}")
    Page<Product> findByCategoryIdAndBrandIdForUser(List<String> categoryIds, String brandId, Pageable pageable);

    @Query("{'$and': " +
            "[{'categoryId': {'$in': ?0}}," +
            " {'brandId': ?1}," +
            " {'gender': ?2}," +
            " {'enabled': true}," +
            " {'isDeleted': false}]}")
    Page<Product> findByCategoryIdAndBrandIdAndGenderForUser(List<String> categoryIds, String brandId, Gender gender, Pageable pageable);

    @Query("{'$and': " +
            "[{'categoryId': {'$in': ?0}}," +
            " {'gender': ?1}," +
            " {'enabled': true}," +
            " {'isDeleted': false}]}")
    Page<Product> findByCategoryIdAndGenderForUser(List<String> categoryIds, Gender gender, Pageable pageable);

    @Query("{'$and': " +
            "[{'brandId': ?0}," +
            " {'gender': ?1}," +
            " {'enabled': true}," +
            " {'isDeleted': false}]}")
    Page<Product> findByBrandIdAndGenderForUser(String brandId, Gender gender, Pageable pageable);

    @Query("{'createdDateTime': {'$gt': ?0}}")
    Page<Product> findProductsCreatedAfterForUser(LocalDateTime createdDateTime, Pageable pageable);

    @Query("{'createdDateTime': {'$gt': ?0} , 'gender': ?1}")
    Page<Product> findProductsCreatedAfterAndGenderForUser(LocalDateTime createdDateTime, Gender gender, Pageable pageable);

    @Query("{'$and': ["
            + "{'productVariants.color': {'$regex': ?0, '$options': 'i'}},"
            + "{'enabled': true},"
            + "{'isDeleted': false}"
            + "]}")
    Page<Product> findByColorInVariantsForUser(String color, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'categoryId': {'$in': ?1}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndCategoryIdForUser(String color, List<String> categoryIds, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'brandId': ?1}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndBrandIdForUser(String color, String brandId, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndGenderForUser(String color, Gender gender, Pageable pageable);

    @Query("{'$and': [" +
            "{'$text': {'$search': ?0}}," +
            "{'gender': ?1}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByKeywordAndGenderForUser(String keyword, Gender gender, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'categoryId': {'$in': ?2}}," +
            "{'brandId': ?3}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorGenderCategoryBrandForUser(String color, Gender gender, List<String> categoryIds, String brandId, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'categoryId': {'$in': ?2}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndGenderAndCategoryIdForUser(String color, Gender gender, List<String> categoryIds, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'brandId': ?2}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndGenderAndBrandIdForUser(String color, Gender gender, String brandId, Pageable pageable);

    @Query("{'$and': [" +
            "{'gender': ?0}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByGenderForUser(Gender gender, Pageable pageable);

    @Query("{'$and': [" +
            "{'price': {'$gte': ?0, '$lte': ?1}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByPriceRangeForUser(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'gender': ?0}," +
            "{'price': {'$gte': ?1, '$lte': ?2}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByGenderAndPriceRangeForUser(Gender gender, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'gender': ?0}," +
            "{'categoryId': {'$in': ?1}}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByGenderCategoryAndPriceRangeForUser(Gender gender, List<String> categoryIds, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'gender': ?0}," +
            "{'brandId': ?1}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByGenderBrandAndPriceRangeForUser(Gender gender, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);


    @Query("{'$and': [" +
            "{'categoryId': {'$in': ?0}}," +
            "{'price': {'$gte': ?1, '$lte': ?2}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByCategoryAndPriceRangeForUser(List<String> categoryIds, BigDecimal  minPrice, BigDecimal  maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'brandId': ?0}," +
            "{'price': {'$gte': ?1, '$lte': ?2}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByBrandAndPriceRangeForUser(String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'categoryId': {'$in': ?0}}," +
            "{'brandId': ?1}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByCategoryBrandAndPriceRangeForUser(List<String> categoryIds, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'price': {'$gte': ?1, '$lte': ?2}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorAndPriceRangeForUser(String color, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'categoryId': {'$in': ?1}}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorCategoryAndPriceRangeForUser(String color, List<String> categoryIds, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'brandId': ?1}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorBrandAndPriceRangeForUser(String color, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'categoryId': {'$in': ?1}}," +
            "{'brandId': ?2}," +
            "{'price': {'$gte': ?3, '$lte': ?4}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorCategoryBrandAndPriceRangeForUser(String color, List<String> categoryIds, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'gender': ?0}," +
            "{'categoryId': {'$in': ?1}}," +
            "{'brandId': ?2}," +
            "{'price': {'$gte': ?3, '$lte': ?4}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByGenderCategoryBrandPriceRangeForUser(Gender gender, List<String> categoryIds, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'categoryId': {'$in': ?2}}," +
            "{'brandId': ?3}," +
            "{'price': {'$gte': ?4, '$lte': ?5}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorGenderCategoryBrandPriceRangeForUser(String color, Gender gender, List<String> categoryIds, String brandId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("{'$and': [" +
            "{'productVariants.color': {'$regex': ?0, '$options': 'i'}}," +
            "{'gender': ?1}," +
            "{'price': {'$gte': ?2, '$lte': ?3}}," +
            "{'enabled': true}," +
            "{'isDeleted': false}" +
            "]}")
    Page<Product> findByColorGenderPriceRangeFilter(String color, Gender gender, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);



    //merchant
    @Query("{'merchantId': ?0, 'isDeleted': false}")
    Page<Product> findByMerchantIdAndDeletedNot(String merchantId, Pageable pageable);

    //admin

    @Query("{'merchantId': ?0}")
    Page<Product> findByMerchant(String merchantId, Pageable pageable);

    Page<Product> findByEnabledFalse(Pageable pageable);

    @Query("{'isDeleted': true}")
    Page<Product> findByIsDeletedTrue(Pageable pageable);

    Page<Product> findByCategoryIdIn(List<String> categoryIds, Pageable pageable);

    @Query("{'$text': {'$search': ?0}}")
    Page<Product> findByKeyword(String keyword, Pageable pageable);
}