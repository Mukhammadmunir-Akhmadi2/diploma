package com.fosso.backend.fosso_backend.category.controller.admin;

import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.category.mapper.CategoryMapper;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.service.admin.AdminCategoryService;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {
    private final AdminCategoryService categoryService;

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listCategoriesByPage(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Category> pageCategories = categoryService.listByPage(keyword, pageable);
        List<CategoryDTO> categoryDTOs = pageCategories.getContent().stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageCategories, categoryDTOs));
    }

    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryId) {
        String result = categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/enable/{categoryId}")
    public ResponseEntity<String> updateCategoryEnabledStatus(
            @PathVariable String categoryId,
            @RequestParam boolean enabled) {
        categoryService.updateCategoryEnabledStatus(categoryId, enabled);
        return ResponseEntity.ok(categoryService.updateCategoryEnabledStatus(categoryId, enabled));
    }

    @GetMapping("/disabled")
    public ResponseEntity<List<CategoryDTO>> getDisabledCategories() {
        List<Category> disabledCategories = categoryService.getAllDisabledCategories();
        return ResponseEntity.ok(CategoryMapper.toDTOList(disabledCategories));
    }
    @PutMapping("/merge")
    public ResponseEntity<String> mergeCategories(
            @RequestParam String sourceCategoryId,
            @RequestParam String targetCategoryId) {
        return ResponseEntity.ok(categoryService.mergeCategories(sourceCategoryId, targetCategoryId));
    }

    @PutMapping("/update")
    public ResponseEntity<CategoryDTO> updateCategory(
            @RequestBody @Valid CategoryDTO updatedTargetCategory,
            BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        Category category = categoryService.updateCategory(CategoryMapper.toEntity(updatedTargetCategory));
        return ResponseEntity.ok(CategoryMapper.toDTO(category));
    }

}
