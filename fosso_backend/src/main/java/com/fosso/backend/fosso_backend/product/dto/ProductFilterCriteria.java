package com.fosso.backend.fosso_backend.product.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductFilterCriteria {
    private String keyword;
    private String categoryId;
    private List<String> categoryIds;
    private String brandId;
    private Gender gender;
    private String merchantId;
    private boolean newIn;
    private String color;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
