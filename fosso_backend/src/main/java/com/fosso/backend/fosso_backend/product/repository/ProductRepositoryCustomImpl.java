package com.fosso.backend.fosso_backend.product.repository;

import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.fosso.backend.fosso_backend.common.utils.FilterUtils.hasValue;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Product> findByDynamicCriteria(ProductFilterCriteria criteria, Pageable pageable) {
        Query query = new Query();

        List<Criteria> filterCriterias = new ArrayList<>();

        // base conditions
        filterCriterias.add(Criteria.where("enabled").is(true));
        filterCriterias.add(Criteria.where("isDeleted").is(false));

        // Full-text search
        if (hasValue(criteria.getKeyword())) {
            query.addCriteria(TextCriteria.forDefaultLanguage().matching(criteria.getKeyword()));
        }

        // Category filter
        if (hasValue(criteria.getCategoryIds())) {
            filterCriterias.add(Criteria.where("categoryId").in(criteria.getCategoryIds()));
        }

        // Brand filter
        if (hasValue(criteria.getBrandId())) {
            filterCriterias.add(Criteria.where("brandId").is(criteria.getBrandId()));
        }

        // Gender filter
        if (hasValue(criteria.getGender())) {
            filterCriterias.add(Criteria.where("gender").is(criteria.getGender()));
        }

        // Color filter
        if (hasValue(criteria.getColor())) {
            filterCriterias.add(Criteria.where("productVariants.color").regex(criteria.getColor(), "i"));
        }

        // Price filter
        if (hasValue(criteria.getMinPrice()) || hasValue(criteria.getMaxPrice())) {
            Criteria priceCriteria = Criteria.where("price");
            if (criteria.getMinPrice() != null) {
                priceCriteria.gte(criteria.getMinPrice());
            }
            if (criteria.getMaxPrice() != null) {
                priceCriteria.lte(criteria.getMaxPrice());
            }
            filterCriterias.add(priceCriteria);
        }

        // New In filter (products added in the last 30 days)
        if (criteria.isNewIn()) {
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            filterCriterias.add(Criteria.where("createdDateTime").gt(thirtyDaysAgo));
        }

        if (!filterCriterias.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(filterCriterias.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, Product.class);

        query.with(pageable);

        List<Product> products = mongoTemplate.find(query, Product.class);

        return new PageImpl<>(products, pageable, total);
    }
}
