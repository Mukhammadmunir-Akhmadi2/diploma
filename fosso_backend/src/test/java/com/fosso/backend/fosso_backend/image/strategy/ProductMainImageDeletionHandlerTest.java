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
class ProductMainImageDeletionHandlerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductMainImageDeletionHandler productMainImageDeletionHandler;

    @Test
    void supports_returnsTrueOnlyForProductImageMain() {
        assertThat(productMainImageDeletionHandler.supports(ImageType.PRODUCT_IMAGE_MAIN)).isTrue();
        assertThat(productMainImageDeletionHandler.supports(ImageType.PRODUCT_IMAGE)).isFalse();
    }

    @Test
    void handleImageDeletion_delegatesToProductService() {
        productMainImageDeletionHandler.handleImageDeletion("prod-1", "image-1");

        verify(productService).removeMainImage("prod-1", "image-1");
    }
}
