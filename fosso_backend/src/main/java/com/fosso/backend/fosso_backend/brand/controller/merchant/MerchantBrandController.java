package com.fosso.backend.fosso_backend.brand.controller.merchant;

import com.fosso.backend.fosso_backend.brand.dto.BrandDTO;
import com.fosso.backend.fosso_backend.brand.mapper.BrandMapper;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.service.BrandService;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/merchant/brands")
@RequiredArgsConstructor
public class MerchantBrandController {

    private final BrandService brandService;

    @PutMapping("/{categoryId}/brand/{brandId}")
    public ResponseEntity<String> addCategoryToBrand(@PathVariable String categoryId, @PathVariable String brandId) {
        return ResponseEntity.ok(brandService.addCategory(brandId, categoryId));
    }

    @GetMapping("check-name")
    public ResponseEntity<String> checkBrandName(@RequestParam String name, @RequestParam(required = false) String brandId) {
        if(brandService.isNameUnique(name, brandId)) {
            throw new DuplicateResourceException("Brand name already exists");
        }
        return ResponseEntity.ok("Brand name is unique");
    }

    @PostMapping
    public ResponseEntity<BrandDTO> createBrand(@RequestBody @Valid BrandDTO brandDTO, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        Brand brand = BrandMapper.toEntity(brandDTO);
        Brand savedBrand = brandService.saveBrand(brand);
        return ResponseEntity.ok(BrandMapper.toDTO(savedBrand));
    }
}
