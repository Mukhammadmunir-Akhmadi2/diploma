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
class BrandImageDeletionHandlerTest {

    @Mock
    private BrandService brandService;

    @InjectMocks
    private BrandImageDeletionHandler brandImageDeletionHandler;

    @Test
    void supports_returnsTrueOnlyForBrandImage() {
        assertThat(brandImageDeletionHandler.supports(ImageType.BRAND_IMAGE)).isTrue();
        assertThat(brandImageDeletionHandler.supports(ImageType.CATEGORY_IMAGE)).isFalse();
    }

    @Test
    void handleImageDeletion_delegatesToBrandService() {
        brandImageDeletionHandler.handleImageDeletion("brand-1", "image-1");

        verify(brandService).clearLogoImage("brand-1");
    }
}
