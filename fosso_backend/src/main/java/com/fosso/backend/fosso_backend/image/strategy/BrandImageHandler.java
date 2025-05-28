package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BrandImageHandler implements ImageOwnerHandler {

    private final BrandRepository brandRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.BRAND_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        Brand brand = brandRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        brand.setLogoImageId(imageId);
        brandRepository.save(brand);
    }
}