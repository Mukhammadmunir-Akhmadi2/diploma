package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductImageDeletionHandler implements ImageDeletionHandler {

    private final ProductService productService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.PRODUCT_IMAGE;
    }

    @Override
    public void handleImageDeletion(String ownerId, String inImageId) {
        productService.removeProductImage(ownerId, inImageId);
    }
}
