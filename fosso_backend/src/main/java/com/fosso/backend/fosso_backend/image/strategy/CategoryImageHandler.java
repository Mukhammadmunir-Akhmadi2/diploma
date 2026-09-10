package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryImageHandler implements ImageOwnerHandler {

    private final CategoryService categoryService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.CATEGORY_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        categoryService.attachImage(ownerId, imageId);
    }
}
