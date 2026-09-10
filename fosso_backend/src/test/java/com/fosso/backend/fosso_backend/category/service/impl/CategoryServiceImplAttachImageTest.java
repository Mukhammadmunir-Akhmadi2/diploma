package com.fosso.backend.fosso_backend.category.service.impl;

import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.category.service.CategoryValidator;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplAttachImageTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryValidator categoryValidator;

    @Mock
    private CategoryHierarchyManager hierarchyManager;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    void attachImage_setsImageIdAndSaves_evenWhenCategoryDisabled() {
        Category category = new Category();
        category.setCategoryId("cat-1");
        category.setEnabled(false);
        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        categoryService.attachImage("cat-1", "image-1");

        assertThat(category.getImageId()).isEqualTo("image-1");
        verify(categoryRepository).save(category);
    }

    @Test
    void attachImage_throwsWhenCategoryNotFound() {
        when(categoryRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.attachImage("missing", "image-1"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void clearImage_setsImageIdToNullAndSaves() {
        Category category = new Category();
        category.setCategoryId("cat-1");
        category.setImageId("image-1");
        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        categoryService.clearImage("cat-1");

        assertThat(category.getImageId()).isNull();
        verify(categoryRepository).save(category);
    }
}
