package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductImageHandler implements ImageOwnerHandler {

    private final ProductService productService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.PRODUCT_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        productService.addProductImage(ownerId, imageId);
    }
}