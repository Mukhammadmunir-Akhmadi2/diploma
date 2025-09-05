package com.fosso.backend.fosso_backend.brand.service.admin.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;
import com.fosso.backend.fosso_backend.brand.service.admin.AdminBrandService;
import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class AdminBrandServiceImpl implements AdminBrandService {
    private final BrandRepository brandRepository;

    @Override
    @Loggable(action = "UPDATE", entity = "Brand", message = "Updated brand details")
    public Brand updateBrand(String brandId, Brand brand) {
        Brand existingBrand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brand.getBrandId()));

        if (!Objects.equals(existingBrand.getName(), brand.getName()) &&
                brandRepository.existsByName(brand.getName())) {
            throw new DuplicateResourceException("Brand name already exists: " + brand.getName());
        }
        existingBrand.setName(brand.getName());
        existingBrand.setDescription(brand.getDescription());
        existingBrand.setCategoryIds(brand.getCategoryIds());
        existingBrand.setUpdatedTime(LocalDateTime.now());
        existingBrand.setCreatedTime(LocalDateTime.now());

        return brandRepository.save(existingBrand);
    }

    @Override
    @Loggable(action = "DELETE", entity = "Brand", message = "Deleted brand")
    public void deleteBrand(String brandId) {
        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException("Brand not found with ID: " + brandId);
        }
        brandRepository.deleteById(brandId);
    }

    @Override
    @Loggable(action = "UPDATE", entity = "Brand",message = "Updated brand enabled status")
    public String updateBrandEnabledStatus(String brandId, boolean enabled) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brandId));
        brand.setEnabled(enabled);
        brand.setUpdatedTime(LocalDateTime.now());
        brandRepository.save(brand);

        return enabled ? "Brand enabled successfully" : "Brand disabled successfully";
    }

    @Override
    public List<Brand> getAllDisabledBrands() {
        List<Brand> disabledBrands = brandRepository.findAll();
        if (disabledBrands.isEmpty()) {
            throw new ResourceNotFoundException("Disabled brands not found");
        }
        return disabledBrands;}

    @Override
    public Page<Brand> listByPage(String keyword, Pageable pageable) {
        if (keyword != null) {
            return brandRepository.findByKeyword(keyword, pageable);
        }
        return brandRepository.findAll(pageable);
    }
}
