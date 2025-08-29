package com.fosso.backend.fosso_backend.product.service.admin.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.product.service.admin.AdminProductService;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final ActionLogService actionLogService;
    private final AuthenticatedUserProvider userProvider;


    @Override
    public String deleteProduct(String productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        productRepository.delete(product);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "DELETE",
                "Product",
                productId,
                "Deleted product"
        );

        return "Product deleted successfully";
    }

    @Override
    public Page<Product> listDisabledProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByEnabledFalse(pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No disabled products found");
        }
        return products;
    }

    @Override
    public Page<Product> listDeletedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsDeletedTrue(pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No deleted products found");
        }
        return products;
    }

    @Override
    public Page<Product> listProducts(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return productRepository.findByKeyword(keyword, pageable);
        }
        return productRepository.findAll(pageable);
    }

    @Override
    public String restoreProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        if (!product.isDeleted()) {
            throw new IllegalStateException("Product is not deleted");
        }

        product.setDeleted(false);
        productRepository.save(product);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "RESTORE",
                "Product",
                productId,
                "Restored product: " + product.getProductName()
        );

        return "Product restored successfully";
    }
    @Override
    public Page<Product> listAllByMerchantId(String merchantId, Pageable pageable) {
        Page<Product> products = productRepository.findByMerchant(merchantId, pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No products found for merchant ID: " + merchantId);
        }
        return products;
    }

    @Override
    public String updateProductEnabledStatus(String productId, boolean enabled) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        product.setEnabled(enabled);
        productRepository.save(product);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Product",
                productId,
                "Updated product enabled status to " + enabled
        );

        return enabled ? "Product enabled successfully" : "Product disabled successfully";
    }
}