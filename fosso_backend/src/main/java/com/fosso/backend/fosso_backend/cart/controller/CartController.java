package com.fosso.backend.fosso_backend.cart.controller;

import com.fosso.backend.fosso_backend.cart.dto.CartItemCreateDTO;
import com.fosso.backend.fosso_backend.cart.dto.CartItemDTO;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.cart.service.CartItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;
    private final ProductRepository productRepository;

    @GetMapping("/{customerId}")
    public ResponseEntity<Map<String, Object>> getCartItems(@PathVariable String customerId) {
        List<CartItemDTO> cartItemDTOs = cartItemService.listCartItems(customerId);

        BigDecimal totalAmount = cartItemDTOs.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("cartItems", cartItemDTOs);
        response.put("totalItems", cartItemDTOs.size());
        response.put("totalAmount", totalAmount);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(@Valid @RequestBody CartItemCreateDTO cartItemCreateDTO, BindingResult bindingResult) {
        System.out.println("cartItemCreateDTO = " + cartItemCreateDTO);
        ValidationUtils.validate(bindingResult);
        cartItemService.addProduct(cartItemCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product added to cart successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<CartItemDTO> updateCartItemQuantity(
            @RequestParam String cartId,
            @RequestParam int quantity) {

        return ResponseEntity.ok(cartItemService.updateQuantity(cartId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeProductFromCart(
            @RequestParam String cartId) {

        cartItemService.removeProduct(cartId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartItemService.clearCart();
        return ResponseEntity.noContent().build();
    }

}