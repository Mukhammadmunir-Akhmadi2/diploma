package com.fosso.backend.fosso_backend.category.service.admin;

import com.fosso.backend.fosso_backend.category.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminCategoryService {
    String deleteCategory(String categoryId);
    String updateCategoryEnabledStatus(String categoryId, boolean enabled);
    List<Category> getAllDisabledCategories();
    Category updateCategory(Category updatedTargetCategory);
    String mergeCategories(String sourceCategoryId, String targetCategoryId);
    Page<Category> listByPage(String keyword, Pageable pageable);
}
