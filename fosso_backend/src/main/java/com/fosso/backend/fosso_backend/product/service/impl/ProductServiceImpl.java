package com.fosso.backend.fosso_backend.product.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.category.model.Category;
import com.fosso.backend.fosso_backend.category.repository.CategoryRepository;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.product.dto.ProductCreateDTO;
import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.dto.ProductMerchantDTO;
import com.fosso.backend.fosso_backend.product.dto.ProductUpdateDTO;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.common.exception.UnauthorizedException;
import com.fosso.backend.fosso_backend.product.mapper.ProductMapper;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.strategy.ProductFilterStrategy;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final AuthenticatedUserProvider userProvider;
    private final List<ProductFilterStrategy> strategies;
    private final ActionLogService actionLogService;
    private final CategoryRepository categoryRepository;

    @Override
    public Product saveProduct(ProductCreateDTO product) {
        User currentUser = userProvider.getAuthenticatedUser();
        if (!currentUser.getUserId().equals(product.getMerchantId())) {
            throw new UnauthorizedException("You do not have permission to create this product");
        }
        Product newProduct = ProductMapper.createProductFromDTO(product);
        newProduct.setCreatedDateTime(LocalDateTime.now());
        newProduct.setUpdatedDateTime(LocalDateTime.now());
        Product savedProduct = productRepository.save(newProduct);

        // Log the action
        actionLogService.logAction(
                currentUser.getUserId(),
                "CREATE",
                "Product",
                savedProduct.getProductId(),
                "Created a new product"
        );

        return savedProduct;
    }

    @Override
    public Product getProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
    }

    @Override
    public Product updateProduct(String productId, ProductUpdateDTO product) {
        User currentUser = userProvider.getAuthenticatedUser();

        boolean isAdmin = currentUser.getRoles().contains(Role.ADMIN);
        boolean isMerchant = currentUser.getRoles().contains(Role.MERCHANT);
        boolean isOwner = currentUser.getUserId().equals(product.getMerchantId());

        if (!(isAdmin || (isMerchant && isOwner))) {
            throw new UnauthorizedException("You do not have permission to update this product");
        }
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        ProductMapper.updateProductFromDTO(existingProduct, product);
        Product saveProduct = productRepository.save(existingProduct);

        actionLogService.logAction(
                currentUser.getUserId(),
                "UPDATE",
                "Product",
                productId,
                "Updated product details"
        );

        return saveProduct;
    }

    @Override
    public String updateProductPrice(String productId, BigDecimal price, BigDecimal discountPrice) {
        User currentUser = userProvider.getAuthenticatedUser();
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (!currentUser.getUserId().equals(existingProduct.getMerchantId())) {
            throw new UnauthorizedException("You do not have permission to update this product");
        }

        existingProduct.setPrice(price);
        existingProduct.setDiscountPrice(discountPrice);
        productRepository.save(existingProduct);

        actionLogService.logAction(
                currentUser.getUserId(),
                "UPDATE",
                "Product",
                productId,
                "Updated product price"
        );

        return "Product price updated successfully";
    }

    @Override
    public String deleteProduct(String productId) {
        User currentUser = userProvider.getAuthenticatedUser();
        Product product = productRepository.findById(productId).orElseThrow(() ->
                new ResourceNotFoundException("Product not found with ID: " + productId));
        if (!currentUser.getProductsId().contains(product.getProductId())) {
            throw new UnauthorizedException("You do not have permission to delete this product");
        }
        product.setDeleted(true);
        productRepository.save(product);

        actionLogService.logAction(
                currentUser.getUserId(),
                "DELETE",
                "Product",
                productId,
                "Deleted product"
        );
        return "Product deleted successfully";
    }

    @Override
    public String updateProductEnabledStatus(String productId, boolean enabled) {
        User currentUser = userProvider.getAuthenticatedUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        if (!currentUser.getUserId().equals(product.getMerchantId())) {
            throw new UnauthorizedException("You do not have permission to update this product");
        }
        product.setEnabled(enabled);
        productRepository.save(product);

        actionLogService.logAction(
                currentUser.getUserId(),
                "UPDATE",
                "Product",
                productId,
                "Updated product enabled status to " + enabled
        );

        return enabled ? "Product enabled successfully" : "Product disabled successfully";
    }

    @Override
    public Page<Product> getFilteredProducts(ProductFilterCriteria criteria, Pageable pageable) {
        if (criteria.getCategoryId() != null) {
            List<String> categoryIds = getAllCategoryIds(criteria.getCategoryId());
            categoryIds.add(criteria.getCategoryId());
            criteria.setCategoryIds(categoryIds);
        } else {
            criteria.setCategoryIds(null);
        }

        Page<Product> products = strategies.stream()
                .filter(strategy -> strategy.isApplicable(criteria))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No matching filter strategy found"))
                .filter(criteria, pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No products found matching the criteria");
        }
        return products;
    }

    private List<String> getAllCategoryIds(String parentId) {
        List<String> categoryIds = new ArrayList<>();
        List<Category> subcategories = categoryRepository.findByParentIdAndEnabledTrue(parentId);

        for (Category subcategory : subcategories) {
            categoryIds.add(subcategory.getCategoryId());
            categoryIds.addAll(getAllCategoryIds(subcategory.getCategoryId()));
        }

        return categoryIds;
    }

    @Override
    public Page<Product> getMarchantProducts(Pageable pageable) {
        User currentUser = userProvider.getAuthenticatedUser();
        Page<Product> products = productRepository.findByMerchantIdAndDeletedNot(currentUser.getUserId(), pageable);
        if (products == null || products.isEmpty()) {
            throw new ResourceNotFoundException("No products found matching the criteria");
        }
        return products;
    }

    @Override
    public Product getMarchantProductsById(String productId) {
        User currentUser = userProvider.getAuthenticatedUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        if (!currentUser.getUserId().equals(product.getMerchantId())) {
           throw new UnauthorizedException("You do not have permission to update this product");
        }
        return product;
    }

    @Override
    public String incrementReviewCount(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        product.setReviewCount(product.getReviewCount() + 1);
        productRepository.save(product);
        return "success";
    }
}