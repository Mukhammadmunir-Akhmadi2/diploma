package com.fosso.backend.fosso_backend.product.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Season;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateDTO {
    @NotNull(message = "Merchant is required")
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
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @NotNull(message = "Gender is required")
    private Gender gender;
    private Season season;

    @NotEmpty(message = "Product variants list must not be empty")
    @Valid
    private List<ProductVariantDTO> productVariants;
    private Boolean enabled;
    private Map<String, String> details;
}