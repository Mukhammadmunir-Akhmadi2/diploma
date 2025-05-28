package com.fosso.backend.fosso_backend.brand.mapper;

import com.fosso.backend.fosso_backend.brand.dto.BrandDTO;
import com.fosso.backend.fosso_backend.brand.model.Brand;

import java.util.List;
import java.util.stream.Collectors;

public class BrandMapper {
    public static BrandDTO toDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setBrandId(brand.getBrandId());
        dto.setName(brand.getName());
        dto.setDescription(brand.getDescription());
        dto.setCategoryIds(brand.getCategoryIds());
        dto.setLogoImageId(brand.getLogoImageId());
        dto.setEnabled(brand.isEnabled());
        return dto;
    }

    public static Brand toEntity(BrandDTO dto) {
        Brand brand = new Brand();
        brand.setBrandId(dto.getBrandId());
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        dto.setCategoryIds(brand.getCategoryIds());
        dto.setLogoImageId(brand.getLogoImageId());
        dto.setEnabled(brand.isEnabled());
        return brand;
    }

    public static List<BrandDTO> toDTOList(List<Brand> brands) {
        return brands.stream().map(BrandMapper::toDTO).collect(Collectors.toList());
    }
}
