package com.fosso.backend.fosso_backend.product.strategy;

import com.fosso.backend.fosso_backend.common.utils.FilterUtils;
import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MerchantFilter implements ProductFilterStrategy {
    private final ProductRepository productRepository;

    @Override
    public boolean isApplicable(ProductFilterCriteria criteria) {
        return FilterUtils.hasValue(criteria.getMerchantId());
    }

    @Override
    public Page<Product> filter(ProductFilterCriteria criteria, Pageable pageable) {
        return productRepository.findByMerchantIdAndDeletedNot(criteria.getMerchantId(), pageable);
    }
}
