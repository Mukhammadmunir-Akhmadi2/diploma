package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryImageHandler implements ImageOwnerHandler {

    private final CategoryRepository categoryRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.CATEGORY_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        Category category = categoryRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setImageId(imageId);
        categoryRepository.save(category);
    }
}
