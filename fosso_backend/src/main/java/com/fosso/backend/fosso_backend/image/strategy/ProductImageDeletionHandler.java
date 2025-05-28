package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductImageDeletionHandler implements ImageDeletionHandler {

    private final ProductRepository productRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.PRODUCT_IMAGE;
    }

    @Override
    public void handleImageDeletion(String ownerId, String inImageId) {
        Product product = productRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<String> imageList = product.getImagesId().stream()
                .filter(imageId -> !imageId.equals(inImageId))
                        .toList();
        product.setImagesId(imageList);
        productRepository.save(product);
    }
}
