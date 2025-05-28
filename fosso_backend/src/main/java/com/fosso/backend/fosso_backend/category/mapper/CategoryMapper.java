package com.fosso.backend.fosso_backend.category.mapper;

import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
    private final CategoryService categoryService;

    public static CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setImageId(category.getImageId());
        dto.setEnabled(category.isEnabled());
        dto.setParentName(category.getParentName());
        dto.setParentId(category.getParentId());
        dto.setSubCategoriesId(category.getChildren().stream().toList());
        dto.setHasChildren(category.getChildren() != null);
        return dto;
    }

    public static Category toEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setName(categoryDTO.getName());
        category.setImageId(categoryDTO.getImageId());
        category.setEnabled(categoryDTO.getEnabled());
        category.setParentName(categoryDTO.getParentName());
        category.setParentId(categoryDTO.getParentId());
        return category;
    }

    public static List<CategoryDTO> toDTOList(List<Category> disabledCategories) {
        return disabledCategories.stream()
                .map(CategoryMapper::toDTO)
                .toList();
    }
}
