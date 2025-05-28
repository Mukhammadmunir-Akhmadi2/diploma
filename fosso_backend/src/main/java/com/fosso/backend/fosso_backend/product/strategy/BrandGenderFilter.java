package com.fosso.backend.fosso_backend.product.strategy;

import com.fosso.backend.fosso_backend.common.utils.FilterUtils;
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
public class BrandGenderFilter implements ProductFilterStrategy {

    private final ProductRepository productRepository;

    @Override
    public boolean isApplicable(ProductFilterCriteria criteria) {
        return hasValue(criteria.getBrandId())
                && !hasValue(criteria.getCategoryIds())
                && hasValue(criteria.getGender())
                && !hasValue(criteria.getColor())
                && !hasValue(criteria.getMinPrice())
                && !hasValue(criteria.getMaxPrice())
                && !criteria.isNewIn();
    }

    @Override
    public Page<Product> filter(ProductFilterCriteria criteria, Pageable pageable) {
        return productRepository.findByBrandIdAndGenderForUser(
                criteria.getBrandId(),
                criteria.getGender(),
                pageable
        );
    }
}
