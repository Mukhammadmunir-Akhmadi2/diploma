package com.fosso.backend.fosso_backend.brand.controller;

import com.fosso.backend.fosso_backend.brand.dto.BrandDTO;
import com.fosso.backend.fosso_backend.brand.mapper.BrandMapper;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.service.BrandService;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
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

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<List<BrandDTO>> listAllBrands() {
        List<Brand> brands = brandService.listAll();
        return ResponseEntity.ok(BrandMapper.toDTOList(brands));
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> listBrandsByPage(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sort);

        Page<Brand> brands = brandService.listByPage(keyword, pageable);
        List<BrandDTO> brandDTOs = brands.getContent().stream()
                .map(BrandMapper::toDTO)
                .toList();
        return ResponseEntity.ok(PaginationUtil.buildPageResponse(brands, brandDTOs));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BrandDTO>> listBrandsByCategoryId(@PathVariable String categoryId) {
        List<Brand> brands = brandService.listByCategoryId(categoryId);
        return ResponseEntity.ok(BrandMapper.toDTOList(brands));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<BrandDTO> getBrandByName(@PathVariable String name) {
        Brand brand = brandService.getByName(name);
        return ResponseEntity.ok(BrandMapper.toDTO(brand));
    }

    @PutMapping("/{categoryId}/brand/{brandId}")
    public ResponseEntity<String> addCategoryToBrand(@PathVariable String categoryId, @PathVariable String brandId) {
        return ResponseEntity.ok(brandService.addCategory(brandId, categoryId));
    }

    @GetMapping("/{brandId}")
    public ResponseEntity<BrandDTO> getBrandById(@PathVariable String brandId) {
        Brand brand = brandService.getByBrandId(brandId);
        return ResponseEntity.ok(BrandMapper.toDTO(brand));
    }

    @PostMapping
    public ResponseEntity<BrandDTO> createBrand(@RequestBody @Valid BrandDTO brandDTO, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        Brand brand = BrandMapper.toEntity(brandDTO);
        Brand savedBrand = brandService.saveBrand(brand);
        return ResponseEntity.ok(BrandMapper.toDTO(savedBrand));
    }

    @GetMapping("check-name")
    public ResponseEntity<String> checkBrandName(@RequestParam String name, @RequestParam(required = false) String brandId) {
        if(brandService.isNameUnique(name, brandId)) {
            throw new DuplicateResourceException("Brand name already exists");
        }
        return ResponseEntity.ok("Brand name is unique");
    }

}