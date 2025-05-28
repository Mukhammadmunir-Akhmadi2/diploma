package com.fosso.backend.fosso_backend.category.service.admin.impl;

import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryParentManager {
    private final CategoryRepository categoryRepository;
    public void reassignParent(Category category, String newParentId) {
        String oldParentId = category.getParentId();

        if (newParentId == null || newParentId.isEmpty()) {
            category.setLevel(0);
            category.setAllParentIDs("");
        } else {
            Category newParent = categoryRepository.findById(newParentId)
                    .orElseThrow(() -> new ResourceNotFoundException("New parent not found: " + newParentId));

            String newPath = (newParent.getAllParentIDs() == null || newParent.getAllParentIDs().isEmpty())
                    ? newParent.getCategoryId()
                    : newParent.getAllParentIDs() + "," + newParent.getCategoryId();
            category.setLevel(newParent.getLevel() + 1);
            category.setAllParentIDs(newPath);
            category.setParentName(newParent.getName());

            newParent.getChildren().add(category.getCategoryId());
            categoryRepository.save(newParent);
        }

        if (oldParentId != null && !oldParentId.isEmpty()) {
            Category oldParent = categoryRepository.findById(oldParentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Old parent not found: " + oldParentId));
            oldParent.getChildren().remove(category.getCategoryId());
            categoryRepository.save(oldParent);
        }
    }
}
