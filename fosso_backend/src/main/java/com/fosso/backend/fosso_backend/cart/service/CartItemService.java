package com.fosso.backend.fosso_backend.cart.service;

import com.fosso.backend.fosso_backend.cart.dto.CartItemCreateDTO;
import com.fosso.backend.fosso_backend.cart.dto.CartItemDTO;

import java.util.List;

public interface CartItemService {
    List<CartItemDTO> listCartItems(String customerId);
    String addProduct(CartItemCreateDTO cartItemCreate);
    CartItemDTO updateQuantity(String cartId, int quantity);
    void removeProduct(String cartId);
    void clearCart();
}
