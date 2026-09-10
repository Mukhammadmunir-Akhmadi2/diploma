package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryImageDeletionHandler implements ImageDeletionHandler {

    private final CategoryService categoryService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.CATEGORY_IMAGE;
    }

    @Override
    public void handleImageDeletion(String ownerId, String imageId) {
        categoryService.clearImage(ownerId);
    }
}
