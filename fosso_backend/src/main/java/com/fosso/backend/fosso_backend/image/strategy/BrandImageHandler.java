package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.brand.service.BrandService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BrandImageHandler implements ImageOwnerHandler {

    private final BrandService brandService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.BRAND_IMAGE;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        brandService.attachLogoImage(ownerId, imageId);
    }
}
