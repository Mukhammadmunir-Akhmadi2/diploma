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
class ProductImageHandlerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductImageHandler productImageHandler;

    @Test
    void supports_returnsTrueOnlyForProductImage() {
        assertThat(productImageHandler.supports(ImageType.PRODUCT_IMAGE)).isTrue();
        assertThat(productImageHandler.supports(ImageType.PRODUCT_IMAGE_MAIN)).isFalse();
    }

    @Test
    void handleImageAssociation_delegatesToProductService() {
        productImageHandler.handleImageAssociation("prod-1", "image-1");

        verify(productService).addProductImage("prod-1", "image-1");
    }
}
