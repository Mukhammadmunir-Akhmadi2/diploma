package com.fosso.backend.fosso_backend.category.service.admin.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.category.service.CategoryValidator;
import com.fosso.backend.fosso_backend.category.service.admin.AdminCategoryService;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCategoryServiceImpl implements AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryValidator categoryValidator;
    private final CategoryParentManager categoryParentManager;
    private final ActionLogService actionLogService;
    private final AuthenticatedUserProvider userProvider;

    @Override
    public String deleteCategory(String categoryId) {
        Category category = categoryValidator.getExistingCategory(categoryId);
        List<Category> children = categoryRepository.findByParentId(categoryId);
        if (!children.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with ID " + categoryId + " because it has child categories");
        }
        if (category.getParentId() != null) {
            Category parent = categoryRepository.findById(category.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found: " + category.getParentId()));
            parent.getChildren().remove(categoryId);
            categoryRepository.save(parent);
        }
        categoryRepository.delete(category);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "DELETE",
                "Category",
                categoryId,
                "Deleted category"
        );

        return "Category deleted successfully";
    }

    @Override
    public String updateCategoryEnabledStatus(String categoryId, boolean enabled) {
        Category category = categoryValidator.getExistingCategory(categoryId);
        category.setEnabled(enabled);
        categoryRepository.save(category);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Category",
                categoryId,
                "Updated category enabled status to " + enabled
        );

        return "Category status updated successfully";
    }

    @Override
    public List<Category> getAllDisabledCategories() {
        List<Category> disabledCategories = categoryRepository.findByEnabledFalse(Sort.by(Sort.Direction.ASC, "name"));
        if (disabledCategories == null || disabledCategories.isEmpty()) {
            throw new ResourceNotFoundException("No disabled categories found");
        }
        return disabledCategories;
    }
    @Override
    public Category updateCategory(Category updatedTargetCategory) {
        Category existingCategory = categoryRepository.findByCategoryIdAndEnabledTrue(updatedTargetCategory.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + updatedTargetCategory.getCategoryId()));

        String oldParentId = existingCategory.getParentId();
        String newParentId = updatedTargetCategory.getParentId();

        existingCategory.setName(updatedTargetCategory.getName());
        existingCategory.setImageId(updatedTargetCategory.getImageId());
        existingCategory.setEnabled(updatedTargetCategory.isEnabled());
        existingCategory.setUpdatedTime(LocalDateTime.now());

        if (!oldParentId.equals(newParentId)) {
            categoryParentManager.reassignParent(existingCategory, newParentId);
        }
        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Category",
                updatedTargetCategory.getCategoryId(),
                "Updated category details"
        );

        return categoryRepository.save(existingCategory);
    }

    @Override
    public String mergeCategories(String sourceCategoryId, String targetCategoryId) {
        if (sourceCategoryId.equals(targetCategoryId)) {
            throw new IllegalArgumentException("Source and target categories must be different");
        }

        Category sourceCategory = categoryRepository.findByCategoryIdAndEnabledTrue(sourceCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Source category not found with ID: " + sourceCategoryId));
        Category targetCategory = categoryRepository.findByCategoryIdAndEnabledTrue(targetCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Target category not found with ID: " + targetCategoryId));

        sourceCategory.getChildren().forEach(childId -> {
            categoryRepository.findById(childId).ifPresent(child -> {
                child.setParentId(targetCategory.getCategoryId());
                categoryRepository.save(child);
            });
            targetCategory.getChildren().add(childId);
        });
        categoryRepository.save(targetCategory);

        if (sourceCategory.getParentId() != null) {
            categoryRepository.findById(sourceCategory.getParentId()).ifPresent(parent -> {
                parent.getChildren().remove(sourceCategoryId);
                categoryRepository.save(parent);
            });
        }

        categoryRepository.delete(sourceCategory);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "MERGED",
                "Category",
                sourceCategoryId + " " + targetCategoryId,
                "Merged the category " + sourceCategory.getName() + " to " + targetCategory.getName() + " category."
        );

        return "Categories merged successfully";
    }

    @Override
    public Page<Category> listByPage(String keyword, Pageable pageable) {
        if (keyword != null) {
            return categoryRepository.findByKeyword(keyword, pageable);
        }
        return categoryRepository.findAll(pageable);
    }
}
