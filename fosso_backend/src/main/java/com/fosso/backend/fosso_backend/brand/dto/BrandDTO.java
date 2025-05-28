package com.fosso.backend.fosso_backend.brand.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class BrandDTO {
    private String brandId;
    @NotNull(message = "Brand name is required")
    private String name;
    private String description;
    private String logoImageId;
    private Set<String> categoryIds = new HashSet<>();
    private boolean enabled;
}