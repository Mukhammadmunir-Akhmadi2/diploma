package com.fosso.backend.fosso_backend.category.repository;

import com.fosso.backend.fosso_backend.category.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {


    @Query("{'parentId': null, 'enabled': true}")
    List<Category> findByParentIdIsNullAndEnabledTrue(Sort sort);

    List<Category> findByParentIdAndEnabledTrue(String parentId);

    List<Category> findByParentId(String parentId);

    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    Page<Category> findByKeyword(String keyword, Pageable pageable);

    Optional<Category> findByName(String name);

    Optional<Category> findByCategoryIdAndEnabledTrue(String categoryId);

    boolean existsByName(String name);

    List<Category> findByEnabledTrue(Sort sort);
    Page<Category> findByEnabledTrue(Pageable pageable);

    List<Category> findByEnabledFalse(Sort sort);

}