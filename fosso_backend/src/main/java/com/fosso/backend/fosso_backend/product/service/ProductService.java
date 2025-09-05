package com.fosso.backend.fosso_backend.product.service;

import com.fosso.backend.fosso_backend.product.dto.ProductCreateDTO;
import com.fosso.backend.fosso_backend.product.dto.ProductFilterCriteria;
import com.fosso.backend.fosso_backend.product.dto.ProductUpdateDTO;
import com.fosso.backend.fosso_backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;


public interface ProductService {
    Product saveProduct(ProductCreateDTO product);
    Product getProductById(String productId);
    Product updateProduct(String productId, ProductUpdateDTO product);
    Product updateProduct(Product product);
    String updateProductPrice(String productId, BigDecimal price, BigDecimal discountPrice);
    String deleteProduct(String productId);
    String updateProductEnabledStatus(String productId, boolean enabled);
    Page<Product> getFilteredProducts(ProductFilterCriteria criteria, Pageable pageable);
    Page<Product> getMarchantProducts(Pageable pageable);
    Product getMarchantProductsById(String productId);
    String incrementReviewCount(String productId);
}
