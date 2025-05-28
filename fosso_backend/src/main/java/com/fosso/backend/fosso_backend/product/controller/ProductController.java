package com.fosso.backend.fosso_backend.product.controller;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import com.fosso.backend.fosso_backend.product.dto.*;
import com.fosso.backend.fosso_backend.product.mapper.ProductMapper;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String merchantId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) boolean isNewIn,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);

        ProductFilterCriteria filterCriteria = new ProductFilterCriteria();
        filterCriteria.setMerchantId(merchantId);
        filterCriteria.setKeyword(keyword);
        filterCriteria.setCategoryId(categoryId);
        filterCriteria.setBrandId(brandId);
        filterCriteria.setGender(gender);
        filterCriteria.setNewIn(isNewIn);
        filterCriteria.setColor(color);
        filterCriteria.setMinPrice(minPrice);
        filterCriteria.setMaxPrice(maxPrice);

        Page<Product> pageProducts = productService.getFilteredProducts(filterCriteria, pageable);

        List<ProductBriefDTO> products = ProductMapper.convertToBriefDTOs(pageProducts);

        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageProducts, products));
    }

    @GetMapping("/merchant")
    public ResponseEntity<Map<String, Object>> getMerchantProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Product> pageProducts = productService.getMarchantProducts(pageable);
        List<ProductMerchantDTO> products = pageProducts.getContent().stream()
                .map(ProductMapper::convertToMerchantDTO)
                .toList();
        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageProducts, products));
    }

    @GetMapping("/merchant/{productId}")
    public ResponseEntity<ProductMerchantDTO> getMerchantProductById(@PathVariable String productId) {
        Product product = productService.getMarchantProductsById(productId);
        return ResponseEntity.ok(ProductMapper.convertToMerchantDTO(product));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailedDTO> getProductById(@PathVariable String productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(ProductMapper.convertToDetailedDTO(product));
    }

    @PostMapping
    public ResponseEntity<ProductMerchantDTO> createProduct(@Valid @RequestBody ProductCreateDTO productDTO, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        Product savedProduct = productService.saveProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProductMapper.convertToMerchantDTO(savedProduct));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductMerchantDTO> updateProduct(
            @PathVariable String productId,
            @Valid @RequestBody ProductUpdateDTO productDTO, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(ProductMapper.convertToMerchantDTO(productService.updateProduct(productId, productDTO)));
    }

    @PutMapping("/{productId}/price")
    public ResponseEntity<String> updateProductPrice(
            @PathVariable String productId,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal discountPrice) {

        return ResponseEntity.ok(productService.updateProductPrice(productId, price, discountPrice));
    }

    @PutMapping("/{productId}/enabled/{status}")
    public ResponseEntity<String> updateProductEnabledStatus(
            @PathVariable String productId,
            @PathVariable boolean status) {

        return ResponseEntity.ok(productService.updateProductEnabledStatus(productId, status));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(productService.deleteProduct(productId));
    }

    @PutMapping("/{productId}/review-count/increment")
    public ResponseEntity<String> incrementReviewCount(@PathVariable String productId) {
        return ResponseEntity.ok(productService.incrementReviewCount(productId));
    }
}