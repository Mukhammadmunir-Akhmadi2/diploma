package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProductMainImageHandlerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductMainImageHandler productMainImageHandler;

    @Test
    void supports_returnsTrueOnlyForProductImageMain() {
        assertThat(productMainImageHandler.supports(ImageType.PRODUCT_IMAGE_MAIN)).isTrue();
        assertThat(productMainImageHandler.supports(ImageType.PRODUCT_IMAGE)).isFalse();
    }

    @Test
    void handleImageAssociation_delegatesToProductService() {
        productMainImageHandler.handleImageAssociation("prod-1", "image-1");

        verify(productService).addMainImage("prod-1", "image-1");
    }
}
