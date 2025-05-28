package com.fosso.backend.fosso_backend.brand.service;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BrandService {
    List<Brand> listAll();
    Page<Brand> listByPage(String keyword, Pageable pageable);
    Brand getByBrandId(String brandId);
    Brand getByName(String name);
    List<Brand> listByCategoryId(String categoryId);
    Brand saveBrand(Brand brand);
    String addCategory(String brandId, String categoryId);
    boolean isNameUnique(String name, String brandId);
}
