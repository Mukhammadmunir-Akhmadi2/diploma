package com.fosso.backend.fosso_backend.product.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Season;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductUpdateDTO {
    private String productId;
    private String merchantId;
    @NotEmpty(message = "Product name cannot be empty")
    private String productName;

    @NotEmpty(message = "Short description cannot be empty")
    private String shortDescription;

    @NotEmpty(message = "Short description cannot be empty")
    private String fullDescription;

    @NotNull(message = "Category is required")
    private String categoryId;

    @NotNull(message = "Brand is required")
    private String brandId;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal shippingCost;
    private Gender gender;
    private Season season;
    private List<ProductVariantDTO> productVariants;
    private Boolean enabled;
    private Map<String, String> details;
}
