package com.fosso.backend.fosso_backend.product.service.impl;

import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplMainImageTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AuthenticatedUserProvider userProvider;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void addMainImage_appendsToMainImagesIdAndSaves() {
        Product product = new Product();
        product.setProductId("prod-1");
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productService.addMainImage("prod-1", "image-1");

        assertThat(product.getMainImagesId()).containsExactly("image-1");
        verify(productRepository).save(product);
    }

    @Test
    void addMainImage_throwsWhenProductNotFound() {
        when(productRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.addMainImage("missing", "image-1"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void removeMainImage_filtersOutImageIdAndSaves() {
        Product product = new Product();
        product.setProductId("prod-1");
        product.setMainImagesId(List.of("image-1", "image-2"));
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productService.removeMainImage("prod-1", "image-1");

        assertThat(product.getMainImagesId()).containsExactly("image-2");
        verify(productRepository).save(product);
    }
}
