package com.fosso.backend.fosso_backend.brand.controller.admin;

import com.fosso.backend.fosso_backend.brand.dto.BrandDTO;
import com.fosso.backend.fosso_backend.brand.mapper.BrandMapper;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.service.admin.AdminBrandService;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {

    private final AdminBrandService brandService;


    @PutMapping("/{brandId}")
    public ResponseEntity<BrandDTO> updateBrand(@PathVariable String brandId, @RequestBody BrandDTO brandDTO) {
        return ResponseEntity.ok(BrandMapper.toDTO(brandService
                .updateBrand(brandId, BrandMapper.toEntity(brandDTO))));
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

    @DeleteMapping("/{brandId}")
    public ResponseEntity<Void> deleteBrand(@PathVariable String brandId) {
        brandService.deleteBrand(brandId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{brandId}/enabled")
    public ResponseEntity<String> updateBrandEnabledStatus(@PathVariable String brandId, @RequestParam boolean enabled) {
        return ResponseEntity.ok(brandService.updateBrandEnabledStatus(brandId, enabled));
    }
    @GetMapping("/disabled")
    public ResponseEntity<List<BrandDTO>> getAllDisabledBrands() {
        return ResponseEntity.ok(BrandMapper.toDTOList(brandService.getAllDisabledBrands()));
    }
}
