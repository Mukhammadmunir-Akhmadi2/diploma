package com.fosso.backend.fosso_backend.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductBriefDTO {
    private String productId;
    private String brandId;
    private List<String> mainImagesId;
    private String productName;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String categoryId;
    private Double rating;
    private Integer reviewCount;
    private String createdDateTime;
}
