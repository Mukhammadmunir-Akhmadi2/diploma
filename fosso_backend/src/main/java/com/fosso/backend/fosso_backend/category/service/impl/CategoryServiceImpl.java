package com.fosso.backend.fosso_backend.category.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.category.service.CategoryValidator;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryValidator categoryValidator;
    private final CategoryHierarchyManager hierarchyManager;
    private final ActionLogService actionLogService;
    private final AuthenticatedUserProvider userProvider;


    @Override
    public List<Category> listAll() {
        return categoryRepository.findByEnabledTrue(Sort.by(Sort.Direction.ASC, "name"));
    }

    public List<Category> listByParentId(String parentId) {
        if (parentId == null || parentId.equals("root")) {
            return categoryRepository.findByParentIdIsNullAndEnabledTrue(Sort.by(Sort.Direction.ASC, "name"));
        }
        return categoryRepository.findByParentIdAndEnabledTrue(parentId);
    }

    @Override
    public Page<Category> listByPage(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return categoryRepository.findByKeyword(keyword, pageable);
        }
        return categoryRepository.findByEnabledTrue(pageable);
    }

    @Override
    public Optional<Category> getCategoryById(String categoryId) {
        return categoryRepository.findByCategoryIdAndEnabledTrue(categoryId);
    }

    @Override
    public Category saveCategory(Category category) {
        categoryValidator.validateNewCategory(category);

        category.setCategoryId(UUID.randomUUID().toString());
        category.setCreatedTime(LocalDateTime.now());
        category.setUpdatedTime(LocalDateTime.now());
        category.setEnabled(true);

        hierarchyManager.configureHierarchy(category);
        Category savedCategory = categoryRepository.save(category);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "CREATE",
                "Category",
                savedCategory.getCategoryId(),
                "Saved a new category"
        );

        return savedCategory;
    }

    @Override
    public boolean isNameUnique(String name, String categoryId) {
        Category categoryByName = categoryRepository.findByName(name).orElse(null);
        return categoryByName == null || categoryByName.getCategoryId().equals(categoryId);
    }

    @Override
    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIdIsNullAndEnabledTrue(Sort.by(Sort.Direction.ASC, "name"));
    }

    @Override
    public List<Category> getAboveCategories(String categoryId) {
        List<Category> ancestors = new ArrayList<>();

        Optional<Category> currentOpt = categoryRepository.findById(categoryId);
        while (currentOpt.isPresent()) {
            Category current = currentOpt.get();
            if (current.getParentId() == null) break; // reached root

            Optional<Category> parentOpt = categoryRepository.findById(current.getParentId());
            if (parentOpt.isPresent()) {
                ancestors.add(0, parentOpt.get()); // insert at beginning
                currentOpt = parentOpt;
            } else {
                break;
            }
        }

        return ancestors;
    }

}