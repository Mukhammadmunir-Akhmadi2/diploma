package com.fosso.backend.fosso_backend.product.service.admin;

import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminProductService {
    String deleteProduct(String productId);
    Page<Product> listAllByMerchantId(String merchantId, Pageable pageable);
    String updateProductEnabledStatus(String productId, boolean enabled);
    Page<Product> listDisabledProducts(Pageable pageable);
    Page<Product> listDeletedProducts(Pageable pageable);
    Page<Product> listProducts(String keyword, Pageable pageable);
    String restoreProduct(String productId);
}
