package com.fosso.backend.fosso_backend.image.strategy;


import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BrandImageDeletionHandler implements ImageDeletionHandler {

    private final BrandRepository brandRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.BRAND_IMAGE;
    }

    @Override
    public void handleImageDeletion(String ownerId, String imageId) {
        Brand brand = brandRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        brand.setLogoImageId(null); // Remove the image association
        brandRepository.save(brand);
    }
}