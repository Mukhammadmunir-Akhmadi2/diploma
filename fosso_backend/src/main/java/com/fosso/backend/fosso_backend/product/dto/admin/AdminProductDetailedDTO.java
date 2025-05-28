package com.fosso.backend.fosso_backend.product.dto.admin;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Season;
import com.fosso.backend.fosso_backend.product.model.ProductVariant;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminProductDetailedDTO {
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
    private Integer reviewCount;
    private List<ProductVariant> productVariants;
    private List<String> mainImagesId;
    private List<String> imagesId;
    private Map<String, String> details;
    private Double rating;
    private String createdDateTime;
    private String updatedDateTime;
    private Boolean enabled;
    private Boolean isDeleted;
}
