package com.fosso.backend.fosso_backend.product.controller.merchant;

import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import com.fosso.backend.fosso_backend.product.dto.ProductCreateDTO;
import com.fosso.backend.fosso_backend.product.dto.ProductMerchantDTO;
import com.fosso.backend.fosso_backend.product.dto.ProductUpdateDTO;
import com.fosso.backend.fosso_backend.product.mapper.ProductMapper;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.service.ProductService;
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
@RequestMapping("/merchant/products")
@RequiredArgsConstructor
public class MerchantProductController {

    private final ProductService productService;

    @GetMapping
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


    @GetMapping("/{productId}")
    public ResponseEntity<ProductMerchantDTO> getMerchantProductById(@PathVariable String productId) {
        Product product = productService.getMarchantProductsById(productId);
        return ResponseEntity.ok(ProductMapper.convertToMerchantDTO(product));
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
}
