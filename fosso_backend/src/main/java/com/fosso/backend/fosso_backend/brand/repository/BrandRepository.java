package com.fosso.backend.fosso_backend.brand.repository;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {

    Page<Brand> findAllAndEnabledTrue(Pageable pageable);

    List<Brand> findAllAndEnabledTrue(Sort sort);

    Optional<Brand> findByName(String name);

    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    Page<Brand> findByKeyword(String keyword, Pageable pageable);

    @Query("{'categoryIds': ?0}")
    List<Brand> findByCategoryId(String categoryId);

    @Query("{'name': {$regex: ?0, $options: 'i'}, 'enabled': true}")
    Page<Brand> findByKeywordAndEnabledTrue(String keyword, Pageable pageable);

    @Query("{'categoryIds': ?0, 'enabled': true}")
    List<Brand> findByCategoryIdAndEnabledTrue(String categoryId);

    boolean existsByName(String name);
}