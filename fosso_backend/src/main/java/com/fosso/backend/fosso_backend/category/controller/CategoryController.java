package com.fosso.backend.fosso_backend.category.controller;

import com.fosso.backend.fosso_backend.category.dto.CategoryDTO;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.category.mapper.CategoryMapper;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.service.CategoryService;
import com.fosso.backend.fosso_backend.category.service.impl.CategoryHierarchyManager;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryHierarchyManager hierarchyManager;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> listAllCategories() {
        List<Category> categories = categoryService.listAll();
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable String id) {
        Category category = categoryService.getCategoryById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category not found with id: " + id)
        );
        return ResponseEntity.ok(CategoryMapper.toDTO(category));
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<CategoryDTO>> listSubcategories(@PathVariable String parentId) {
        List<Category> categories = categoryService.listByParentId(parentId);
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }

    @GetMapping("/root")
    public ResponseEntity<List<CategoryDTO>> listRootCategories() {
        List<Category> categories = categoryService.listByParentId("root");
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }

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

    @GetMapping("/hierarchical")
    public ResponseEntity<List<CategoryDTO>> listHierarchicalCategories() {
        List<Category> rootCategories = categoryService.getRootCategories();
        List<CategoryDTO> categoryDTOs = rootCategories.stream()
                .map(hierarchyManager::buildHierarchy)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }
    @GetMapping("/above/{parentId}")
    public ResponseEntity<List<CategoryDTO>> getAboveCategories(@PathVariable String parentId) {
        List<Category> categories = categoryService.getAboveCategories(parentId);
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }

}
