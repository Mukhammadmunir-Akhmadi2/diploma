package com.fosso.backend.fosso_backend.brand.service.admin;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminBrandService {
    Brand updateBrand(String brandId, Brand brand);
    void deleteBrand(String brandId);
    String updateBrandEnabledStatus(String brandId, boolean enabled);
    List<Brand> getAllDisabledBrands();
    Page<Brand> listByPage(String keyword, Pageable pageable);
}
