package com.fosso.backend.fosso_backend.product.model;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Season;
import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Data
@Document(collection = "products")
public class Product implements LoggableEntity {
    @Id
    private String productId;
    @Indexed
    @TextIndexed
    private String productName;
    @TextIndexed
    private String shortDescription;
    @TextIndexed
    private String fullDescription;
    private String merchantId;
    private String brandId;
    private String categoryId;
    private boolean enabled = true;
    private BigDecimal price = BigDecimal.ZERO;
    private BigDecimal discountPrice = BigDecimal.ZERO;
    private BigDecimal shippingCost = BigDecimal.ZERO;
    private Gender gender;
    private Season season;
    private List<ProductVariant> productVariants = new ArrayList<>();
    private Integer reviewCount = 0;
    private List<String> mainImagesId = new ArrayList<>();
    private List<String> imagesId = new ArrayList<>();
    private Map<String, String> details;
    private Double rating;
    private LocalDateTime createdDateTime;
    private LocalDateTime updatedDateTime;
    private boolean isDeleted = false;

    public void setImageId(String imageId) {
        this.imagesId.add(imageId);
    }
    public void setMainImageId(String mainImageId) {
        this.mainImagesId.add(mainImageId);
    }
    public void setProductVariant(ProductVariant productVariant) {
        this.productVariants.add(productVariant);
    }

    @Override
    public String getEntityId() {
        return productId;
    }
}