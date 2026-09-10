package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CategoryImageHandlerTest {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryImageHandler categoryImageHandler;

    @Test
    void supports_returnsTrueOnlyForCategoryImage() {
        assertThat(categoryImageHandler.supports(ImageType.CATEGORY_IMAGE)).isTrue();
        assertThat(categoryImageHandler.supports(ImageType.BRAND_IMAGE)).isFalse();
    }

    @Test
    void handleImageAssociation_delegatesToCategoryService() {
        categoryImageHandler.handleImageAssociation("cat-1", "image-1");

        verify(categoryService).attachImage("cat-1", "image-1");
    }
}
