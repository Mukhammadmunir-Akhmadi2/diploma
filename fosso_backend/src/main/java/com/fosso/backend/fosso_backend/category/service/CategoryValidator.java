package com.fosso.backend.fosso_backend.category.service;

import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class CategoryValidator {

    private final CategoryRepository categoryRepository;

    public void validateNewCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new DuplicateResourceException("Category name already exists: " + category.getName());
        }
    }

    public void validateUpdate(Category existing, Category updated) {
        if (!Objects.equals(existing.getName(), updated.getName()) &&
                categoryRepository.existsByName(updated.getName())) {
            throw new DuplicateResourceException("Category name already exists: " + updated.getName());
        }
    }

    public Category getExistingCategory(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
    }
}
