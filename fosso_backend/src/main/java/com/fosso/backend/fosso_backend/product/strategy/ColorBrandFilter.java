package com.fosso.backend.fosso_backend.product.strategy;

import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import static com.fosso.backend.fosso_backend.common.utils.FilterUtils.hasValue;

@Component
@RequiredArgsConstructor
public class ColorBrandFilter implements ProductFilterStrategy {
    private final ProductRepository productRepository;

    @Override
    public boolean isApplicable(ProductFilterCriteria criteria) {
        return hasValue(criteria.getColor())
                && hasValue(criteria.getBrandId())
                && !hasValue(criteria.getCategoryIds())
                && !hasValue(criteria.getGender())
                && !hasValue(criteria.getMinPrice())
                && !hasValue(criteria.getMaxPrice());
    }

    @Override
    public Page<Product> filter(ProductFilterCriteria criteria, Pageable pageable) {
        return productRepository.findByColorAndBrandIdForUser(criteria.getColor(), criteria.getBrandId(), pageable);
    }
}