package com.fosso.backend.fosso_backend.cart.mapper;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.cart.dto.CartItemDTO;
import com.fosso.backend.fosso_backend.cart.model.CartItem;
import com.fosso.backend.fosso_backend.image.mapper.ImageMapper;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;

import java.math.BigDecimal;

public class CartItemMapper {
    public static CartItemDTO convertToDTO(CartItem cartItem, Product product, Brand brand, Image image) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartId(cartItem.getCartId());
        dto.setCustomerId(cartItem.getCustomerId());
        dto.setProductId(cartItem.getProductId());
        dto.setColor(cartItem.getColor());
        dto.setSize(cartItem.getSize());
        dto.setQuantity(cartItem.getQuantity());
        dto.setAddedDateTime(DateTimeUtils.toString(cartItem.getAddedDateTime()));

        if (product != null) {
            dto.setProductName(product.getProductName());
            dto.setBrandName(brand != null ? brand.getName() : null);
            dto.setProductImage(ImageMapper.convertToDTO(image));
            BigDecimal unitPrice = product.getDiscountPrice() != null ?
                    product.getDiscountPrice() : product.getPrice();
            dto.setUnitPrice(unitPrice);

            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            dto.setSubtotal(subtotal);
        }

        return dto;
    }
}
