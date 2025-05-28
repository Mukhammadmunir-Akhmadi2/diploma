package com.fosso.backend.fosso_backend.category.service.impl;

import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.category.mapper.CategoryMapper;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoryHierarchyManager {

    private final CategoryRepository categoryRepository;

    public CategoryDTO buildHierarchy(Category category) {
        CategoryDTO dto = CategoryMapper.toDTO(category);

        if (category.getParentId() != null) {
            categoryRepository.findByCategoryIdAndEnabledTrue(category.getParentId())
                    .ifPresent(parent -> dto.setParentName(parent.getName()));
        }

        if (category.getChildren() == null || category.getChildren().isEmpty()) {
            dto.setHasChildren(false);
            return dto;
        }

        List<CategoryDTO> childrenDTOs = category.getChildren()
                .stream()
                .map(categoryId -> categoryRepository.findByCategoryIdAndEnabledTrue(categoryId)
                        .map(this::buildHierarchy)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId))
                )
                .toList();

        dto.setChildren(childrenDTOs);
        dto.setHasChildren(true);

        return dto;
    }

    public void configureHierarchy(Category category) {
        if (category.getParentId() == null || category.getParentId().isEmpty()) {
            category.setLevel(0);
            category.setAllParentIDs("");
            return;
        }

        Category parent = categoryRepository.findById(category.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found: " + category.getParentId()));

        category.setLevel(parent.getLevel() + 1);
        String newPath = (parent.getAllParentIDs() == null || parent.getAllParentIDs().isEmpty())
                ? parent.getCategoryId()
                : parent.getAllParentIDs() + "," + parent.getCategoryId();
        category.setAllParentIDs(newPath);
        category.setParentName(parent.getName());

        parent.getChildren().add(category.getCategoryId());
        categoryRepository.save(parent);

    }
}
