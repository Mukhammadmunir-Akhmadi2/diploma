package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryImageDeletionHandler implements ImageDeletionHandler {

    private CategoryRepository categoryRepository;
    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.CATEGORY_IMAGE;
    }

    @Override
    public void handleImageDeletion(String ownerId, String imageId) {
        Category category = categoryRepository.findById(ownerId).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setImageId(null);
        categoryRepository.save(category);
    }
}
