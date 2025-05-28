package com.fosso.backend.fosso_backend.product.dto.admin;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminProductBriefDTO {
    private String productId;
    private String productName;
    private String shortDescription;
    private String merchantId;
    private String brandId;
    private String categoryId;
    private Boolean enabled;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Gender gender;
    private List<String> mainImagesId;
    private Double rating;
    private Boolean isDeleted;
    private Integer reviewCount;
    private String createdDateTime;
}
