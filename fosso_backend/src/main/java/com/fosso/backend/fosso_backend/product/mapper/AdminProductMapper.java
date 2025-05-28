package com.fosso.backend.fosso_backend.product.mapper;

import com.fosso.backend.fosso_backend.product.dto.admin.AdminProductBriefDTO;
import com.fosso.backend.fosso_backend.product.dto.admin.AdminProductDetailedDTO;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

public class AdminProductMapper {

    public static AdminProductBriefDTO toAdminProductBriefDTO(Product product) {
        return AdminProductBriefDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .shortDescription(product.getShortDescription())
                .merchantId(product.getMerchantId())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .enabled(product.isEnabled())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .gender(product.getGender())
                .mainImagesId(product.getMainImagesId())
                .rating(product.getRating())
                .isDeleted(product.isDeleted())
                .reviewCount(product.getReviewCount())
                .createdDateTime(DateTimeUtils.toString(product.getCreatedDateTime()))
                .build();
    }

    public static AdminProductDetailedDTO toAdminProductDetailedDTO(Product product) {
        return AdminProductDetailedDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .shortDescription(product.getShortDescription())
                .fullDescription(product.getFullDescription())
                .merchantId(product.getMerchantId())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .shippingCost(product.getShippingCost())
                .gender(product.getGender())
                .season(product.getSeason())
                .reviewCount(product.getReviewCount())
                .productVariants(product.getProductVariants())
                .mainImagesId(product.getMainImagesId())
                .imagesId(product.getImagesId())
                .details(product.getDetails())
                .rating(product.getRating())
                .createdDateTime(DateTimeUtils.toString(product.getCreatedDateTime()))
                .updatedDateTime(DateTimeUtils.toString(product.getUpdatedDateTime()))
                .enabled(product.isEnabled())
                .isDeleted(product.isDeleted())
                .build();
    }

    public static List<AdminProductBriefDTO> toAdminProductBriefDTOList(Page<Product> products) {
        return products.getContent().stream()
                .map(AdminProductMapper::toAdminProductBriefDTO)
                .collect(Collectors.toList());
    }
}
