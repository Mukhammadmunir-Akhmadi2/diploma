package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.brand.service.BrandService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BrandImageHandlerTest {

    @Mock
    private BrandService brandService;

    @InjectMocks
    private BrandImageHandler brandImageHandler;

    @Test
    void supports_returnsTrueOnlyForBrandImage() {
        assertThat(brandImageHandler.supports(ImageType.BRAND_IMAGE)).isTrue();
        assertThat(brandImageHandler.supports(ImageType.CATEGORY_IMAGE)).isFalse();
    }

    @Test
    void handleImageAssociation_delegatesToBrandService() {
        brandImageHandler.handleImageAssociation("brand-1", "image-1");

        verify(brandService).attachLogoImage("brand-1", "image-1");
    }
}
