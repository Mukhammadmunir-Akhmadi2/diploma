package com.fosso.backend.fosso_backend.product.mapper;

import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.model.ProductVariant;
import com.fosso.backend.fosso_backend.product.dto.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProductMapper {

    public static ProductDetailedDTO convertToDetailedDTO(Product product) {
        return ProductDetailedDTO.builder()
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
                .productVariants(product.getProductVariants().stream().map(ProductMapper::convertToProductVariantDTO).toList())
                .mainImagesId(product.getMainImagesId())
                .imagesId(product.getImagesId())
                .enabled(product.isEnabled())
                .details(product.getDetails())
                .rating(product.getRating())
                .build();
    }

    public static ProductBriefDTO convertToBriefDTO(Product product) {
        ProductBriefDTO dto = new ProductBriefDTO();
        dto.setProductId(product.getProductId());
        dto.setBrandId(product.getBrandId());
        dto.setProductName(product.getProductName());
        dto.setShortDescription(product.getShortDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setReviewCount(product.getReviewCount());
        dto.setMainImagesId(product.getMainImagesId());
        dto.setCategoryId(product.getCategoryId());
        dto.setRating(product.getRating());
        dto.setCreatedDateTime(DateTimeUtils.toString(product.getCreatedDateTime()));
        dto.setReviewCount(product.getReviewCount());
        return dto;
    }

    public static List<ProductBriefDTO> convertToBriefDTOs(Page<Product> products) {
        return products.getContent().stream()
                .map(ProductMapper::convertToBriefDTO)
                .toList();
    }

    public static ProductVariantDTO convertToProductVariantDTO(ProductVariant productVariant) {
        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setStockQuantity(productVariant.getStockQuantity());
        dto.setColor(productVariant.getColor());
        dto.setSize(productVariant.getSize());
        return dto;
    }
    public static ProductVariant convertToProductVariant(ProductVariantDTO dto) {
        ProductVariant productVariant = new ProductVariant();
        productVariant.setStockQuantity(dto.getStockQuantity());
        productVariant.setColor(dto.getColor());
        productVariant.setSize(dto.getSize());
        return productVariant;
    }

    public static void updateProductFromDTO(Product existingProduct, ProductUpdateDTO dto) {
        existingProduct.setProductName(dto.getProductName());
        existingProduct.setShortDescription(dto.getShortDescription());
        existingProduct.setFullDescription(dto.getFullDescription());
        existingProduct.setCategoryId(dto.getCategoryId());
        existingProduct.setBrandId(dto.getBrandId());
        existingProduct.setPrice(dto.getPrice());
        existingProduct.setDiscountPrice(dto.getDiscountPrice());
        existingProduct.setShippingCost(dto.getShippingCost());
        existingProduct.setGender(dto.getGender());
        existingProduct.setSeason(dto.getSeason());
        existingProduct.setProductVariants(dto.getProductVariants().stream().map(ProductMapper::convertToProductVariant).toList());
        existingProduct.setDetails(dto.getDetails());
        existingProduct.setEnabled(dto.getEnabled());
        existingProduct.setUpdatedDateTime(LocalDateTime.now());
    }
    public static Product createProductFromDTO(ProductCreateDTO dto) {
        Product product = new Product();
        product.setProductId(UUID.randomUUID().toString());
        product.setMerchantId(dto.getMerchantId());
        product.setProductName(dto.getProductName());
        product.setShortDescription(dto.getShortDescription());
        product.setFullDescription(dto.getFullDescription());
        product.setCategoryId(dto.getCategoryId());
        product.setBrandId(dto.getBrandId());
        product.setPrice(dto.getPrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setShippingCost(dto.getShippingCost());
        product.setGender(dto.getGender());
        product.setSeason(dto.getSeason());
        product.setProductVariants(dto.getProductVariants().stream()
                .map(ProductMapper::convertToProductVariant)
                .toList());
        product.setDetails(dto.getDetails());
        product.setEnabled(dto.getEnabled());
        product.setCreatedDateTime(LocalDateTime.now());
        product.setUpdatedDateTime(LocalDateTime.now());
        return product;
    }
    public static ProductMerchantDTO convertToMerchantDTO(Product product) {
        ProductMerchantDTO dto = new ProductMerchantDTO();
        dto.setProductId(product.getProductId());
        dto.setMerchantId(product.getMerchantId());
        dto.setBrandId(product.getBrandId());
        dto.setMainImagesId(product.getMainImagesId());
        dto.setImagesId(product.getImagesId());
        dto.setProductName(product.getProductName());
        dto.setShortDescription(product.getShortDescription());
        dto.setFullDescription(product.getFullDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setCategoryId(product.getCategoryId());
        dto.setRating(product.getRating());
        dto.setEnabled(product.isEnabled());
        dto.setReviewCount(product.getReviewCount());
        dto.setShippingCost(product.getShippingCost());
        dto.setProductVariants(product.getProductVariants().stream()
                .map(ProductMapper::convertToProductVariantDTO)
                .toList());
        dto.setCreatedDateTime(DateTimeUtils.toString(product.getCreatedDateTime()));
        dto.setGender(product.getGender());
        dto.setSeason(product.getSeason());
        dto.setDetails(product.getDetails());
        return dto;
    }
}
