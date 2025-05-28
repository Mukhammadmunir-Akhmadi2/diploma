package com.fosso.backend.fosso_backend.product.controller.admin;

import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import com.fosso.backend.fosso_backend.product.dto.ProductUpdateDTO;
import com.fosso.backend.fosso_backend.product.dto.admin.AdminProductBriefDTO;
import com.fosso.backend.fosso_backend.product.dto.admin.AdminProductDetailedDTO;
import com.fosso.backend.fosso_backend.product.mapper.AdminProductMapper;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import com.fosso.backend.fosso_backend.product.service.admin.AdminProductService;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;
    private final ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<AdminProductDetailedDTO> getProductById(@PathVariable String productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(AdminProductMapper.toAdminProductDetailedDTO(product));
    }

    @GetMapping("/disabled")
    public ResponseEntity<Map<String, Object>> getDisabledProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Product> pageProducts = adminProductService.listDisabledProducts(pageable);

        List<AdminProductBriefDTO> products = AdminProductMapper.toAdminProductBriefDTOList(pageProducts);

        return new ResponseEntity<>(PaginationUtil.buildPageResponse(pageProducts, products), HttpStatus.OK);
    }

    @GetMapping("/deleted")
    public ResponseEntity<Map<String, Object>> getDeletedProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<Product> pageProducts = adminProductService.listDeletedProducts(pageable);

        List<AdminProductBriefDTO> products = AdminProductMapper.toAdminProductBriefDTOList(pageProducts);

        return new ResponseEntity<>(PaginationUtil.buildPageResponse(pageProducts, products), HttpStatus.OK);
    }

    @PutMapping("/{productId}/enabled/{status}")
    public ResponseEntity<String> updateProductEnabledStatus(
            @PathVariable String productId,
            @PathVariable boolean status) {
        return ResponseEntity.ok().body(adminProductService.updateProductEnabledStatus(productId, status));
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
        return ResponseEntity.ok(adminProductService.deleteProduct(productId));
    }

    @PutMapping("/{productId}/restore")
    public ResponseEntity<String> restoreProduct(@PathVariable String productId) {
        return ResponseEntity.ok(adminProductService.restoreProduct(productId));
    }

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<Map<String, Object>> getProductsByMerchant(
            @PathVariable String merchantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);

        Page<Product> pageProducts = adminProductService.listAllByMerchantId(merchantId, pageable);

        List<AdminProductBriefDTO> products = AdminProductMapper.toAdminProductBriefDTOList(pageProducts);

        return new ResponseEntity<>(PaginationUtil.buildPageResponse(pageProducts, products), HttpStatus.OK);
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDateTime,desc") String[] sort) {

        Pageable pageable = PaginationUtil.createPageable(page, size, sort);

        Page<Product> pageProducts = adminProductService.listProducts(keyword, pageable);

        List<AdminProductBriefDTO> products = AdminProductMapper.toAdminProductBriefDTOList(pageProducts);

        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageProducts, products));
    }
}