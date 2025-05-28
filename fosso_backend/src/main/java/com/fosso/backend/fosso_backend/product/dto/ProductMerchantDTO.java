package com.fosso.backend.fosso_backend.product.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Season;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductMerchantDTO {
    private String productId;
    private String merchantId;
    private String brandId;
    private String categoryId;
    private String productName;
    private String shortDescription;
    private String fullDescription;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal shippingCost;
    private Gender gender;
    private Season season;
    private Boolean enabled;
    private Integer reviewCount;
    private List<ProductVariantDTO> productVariants;
    private List<String> mainImagesId;
    private List<String> imagesId;
    private Map<String, String> details;
    private Double rating;
    private String createdDateTime;
}

