package com.fosso.backend.fosso_backend.category.controller.merchant;

import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.category.mapper.CategoryMapper;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/merchant/categories")
@RequiredArgsConstructor
public class MerchantCategoryController {
    private final CategoryService categoryService;

    @PostMapping("/save")
    public ResponseEntity<CategoryDTO> saveCategory(@RequestBody @Valid CategoryDTO category, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        Category savedCategory = categoryService.saveCategory(CategoryMapper.toEntity(category));
        return ResponseEntity.ok(CategoryMapper.toDTO(savedCategory));
    }

    @GetMapping("/check_unique")
    public ResponseEntity<String> checkUnique(
            @RequestParam(required = false) String id,
            @RequestParam String name) {

        boolean isUnique = categoryService.isNameUnique(name, id);
        if(categoryService.isNameUnique(name, id)) {
            throw new DuplicateResourceException("Category already exists: " + name);
        }
        return ResponseEntity.ok("Category name is unique");
    }

}
