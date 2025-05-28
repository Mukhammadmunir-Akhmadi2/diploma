package com.fosso.backend.fosso_backend.product.strategy;

import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductFilterStrategy {
    boolean isApplicable(ProductFilterCriteria criteria);
    Page<Product> filter(ProductFilterCriteria criteria, Pageable pageable);
}