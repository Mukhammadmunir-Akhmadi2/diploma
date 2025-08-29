package com.fosso.backend.fosso_backend.product.repository;

import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepositoryCustom {
    Page<Product> findByDynamicCriteria(ProductFilterCriteria criteria, Pageable pageable);
}
