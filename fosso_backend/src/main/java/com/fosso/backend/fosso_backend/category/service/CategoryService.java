package com.fosso.backend.fosso_backend.category.service;

import com.fosso.backend.fosso_backend.category.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> listAll();
    List<Category> listByParentId(String parentId);
    Page<Category> listByPage(String keyword, Pageable pageable);
    Optional<Category> getCategoryById(String categoryId);
    Category saveCategory(Category category);
    boolean isNameUnique(String name, String categoryId);
    List<Category> getRootCategories();
    List<Category> getAboveCategories(String parentId);
}
