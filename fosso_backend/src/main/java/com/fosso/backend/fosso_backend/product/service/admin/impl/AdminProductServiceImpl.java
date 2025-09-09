package com.fosso.backend.fosso_backend.product.service.admin.impl;

import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.product.service.admin.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;

    @Override
    @Loggable(action = "DELETE", entity = "Product", message = "Deleted product")
    public String deleteProduct(String productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        productRepository.delete(product);
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
        Page<Product> products = productRepository.findByDeletedTrue(pageable);
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
    @Loggable(action = "RESTORE", entity = "Product", message = "Restored product")
    public String restoreProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        if (!product.isDeleted()) {
            throw new IllegalStateException("Product is not deleted");
        }

        product.setDeleted(false);
        productRepository.save(product);

        return "Product restored successfully";
    }
    @Override
    public Page<Product> listAllByMerchantId(String merchantId, Pageable pageable) {
        Page<Product> products = productRepository.findByMerchantId(merchantId, pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No products found for merchant ID: " + merchantId);
        }
        return products;
    }

    @Override
    @Loggable(action = "UPDATE", entity = "Product", message = "Updated product enabled status")
    public String updateProductEnabledStatus(String productId, boolean enabled) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        product.setEnabled(enabled);
        productRepository.save(product);

        return enabled ? "Product enabled successfully" : "Product disabled successfully";
    }
}