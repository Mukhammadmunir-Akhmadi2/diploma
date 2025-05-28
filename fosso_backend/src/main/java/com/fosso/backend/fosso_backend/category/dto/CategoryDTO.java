package com.fosso.backend.fosso_backend.category.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private String categoryId;
    @NotEmpty(message = "Category name cannot be empty")
    private String name;
    private String imageId;
    private Boolean enabled = true;
    private String parentId;
    private String parentName;
    private List<CategoryDTO> children = new ArrayList<>();
    private boolean hasChildren;
    private List<String> subCategoriesId = new ArrayList<>();
}