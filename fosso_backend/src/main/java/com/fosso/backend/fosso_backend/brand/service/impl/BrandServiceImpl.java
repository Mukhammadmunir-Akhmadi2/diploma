package com.fosso.backend.fosso_backend.brand.service.impl;

import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;
import com.fosso.backend.fosso_backend.brand.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public List<Brand> listAll() {
        return brandRepository.findAllByEnabledTrue(Sort.by("name").ascending());
    }

    @Override
    public Page<Brand> listByPage(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return brandRepository.findByKeywordAndEnabledTrue(keyword, pageable);
        }
        return brandRepository.findAllByEnabledTrue(pageable);
    }

    @Override
    public Brand getByBrandId(String id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + id));
    }

    @Override
    public Brand getByName(String name) {
        return brandRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with name: " + name));
    }

    @Override
    public List<Brand> listByCategoryId(String categoryId) {
        return brandRepository.findByCategoryId(categoryId);
    }

    @Override
    @Loggable(action = "CREATE", entity = "Brand", message = "Saved a new brand")
    public Brand saveBrand(Brand brand) {
        if (brandRepository.existsByName(brand.getName())) {
            throw new DuplicateResourceException("Brand name already exists: " + brand.getName());
        }
        brand.setBrandId(UUID.randomUUID().toString());
        brand.setUpdatedTime(LocalDateTime.now());
        brand.setCreatedTime(LocalDateTime.now());

        return brandRepository.save(brand);
    }

    @Override
    @Loggable(action = "CREATE", entity = "Brand", message = "Added category to brand") // needs change
    public String addCategory(String brandId, String categoryId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brandId));

        brand.getCategoryIds().add(categoryId);
        brand.setUpdatedTime(LocalDateTime.now());

        brandRepository.save(brand);

        return "Category added successfully";
    }

    @Override
    public boolean isNameUnique(String name, String brandId) {
        Brand brandByName = brandRepository.findByName(name).orElse(null);
        return brandByName == null || brandByName.getBrandId().equals(brandId);
    }
}