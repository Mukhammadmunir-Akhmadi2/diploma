package com.fosso.backend.fosso_backend.product.strategy;

import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.common.utils.FilterUtils;
import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.fosso.backend.fosso_backend.common.utils.FilterUtils.hasValue;

@Component
@RequiredArgsConstructor
public class CategoryGenderFilter implements ProductFilterStrategy {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public boolean isApplicable(ProductFilterCriteria criteria) {
        return hasValue(criteria.getCategoryIds())
                && !hasValue(criteria.getBrandId())
                && hasValue(criteria.getGender())
                && !hasValue(criteria.getColor())
                && !hasValue(criteria.getMinPrice())
                && !hasValue(criteria.getMaxPrice())
                && !criteria.isNewIn();
    }

    @Override
    public Page<Product> filter(ProductFilterCriteria criteria, Pageable pageable) {
        return productRepository.findByCategoryIdAndGenderForUser(
                criteria.getCategoryIds(),
                criteria.getGender(),
                pageable
        );
    }
}
