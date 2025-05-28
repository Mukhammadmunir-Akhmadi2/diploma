package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductImageHandler implements ImageOwnerHandler {

    private final ProductRepository productRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.PRODUCT_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        Product product = productRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setImageId(imageId);

        productRepository.save(product);
    }
}