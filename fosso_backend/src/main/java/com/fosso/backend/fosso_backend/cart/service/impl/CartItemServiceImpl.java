package com.fosso.backend.fosso_backend.cart.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.repository.BrandRepository;
import com.fosso.backend.fosso_backend.cart.dto.CartItemCreateDTO;
import com.fosso.backend.fosso_backend.cart.dto.CartItemDTO;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.cart.mapper.CartItemMapper;
import com.fosso.backend.fosso_backend.cart.model.CartItem;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.model.ProductVariant;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.cart.repository.CartItemRepository;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.cart.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthenticatedUserProvider userProvider;
    private final ActionLogService actionLogService;
    private final BrandRepository brandRepository;
    private final ImageRepository imageRepository;

    @Override
    public List<CartItemDTO> listCartItems(String customerId) {
        User currentUser = userProvider.getAuthenticatedUser();
        if (!currentUser.getUserId().equals(customerId)) {
            throw new ResourceNotFoundException("You are not authorized to view this cart");
        }
        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new ResourceNotFoundException("No cart item found with id " + customerId);
        }
        return cartItems.stream().map(cartItem -> {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + cartItem.getProductId()));

            Brand brand = brandRepository.findById(product.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + product.getBrandId()));
            Image image = imageRepository.findById(product.getMainImagesId().getFirst())
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + product.getMainImagesId().getFirst()));

            return CartItemMapper.convertToDTO(cartItem, product, brand, image);
        }).toList();
    }

    @Override
    public String addProduct(CartItemCreateDTO cartItemCreate) {
        User customer = userProvider.getAuthenticatedUser();

        Product product = productRepository.findById(cartItemCreate.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + cartItemCreate.getProductId()));

        Optional<ProductVariant> matchingVariant = product.getProductVariants()
                .stream()
                .filter(variant ->
                        variant.getColor().equalsIgnoreCase(cartItemCreate.getColor()) &&
                                variant.getSize().equalsIgnoreCase(cartItemCreate.getSize()))
                .findFirst();

        if (matchingVariant.isEmpty()) {
            throw new IllegalArgumentException("No product variant found with specified color and size.");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCustomerIdAndProductIdAndColorAndSize(
                customer.getUserId(),
                product.getProductId(),
                cartItemCreate.getColor(),
                cartItemCreate.getSize()
        );

        CartItem savedItem;

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int quantity = item.getQuantity() + cartItemCreate.getQuantity();
            if (quantity > matchingVariant.get().getStockQuantity()) {
                throw new IllegalArgumentException("Not enough stock available for this product.");
            }
            item.setQuantity(item.getQuantity() + cartItemCreate.getQuantity());

            savedItem = cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCartId(UUID.randomUUID().toString());
            newItem.setCustomerId(customer.getUserId());
            newItem.setProductId(product.getProductId());
            newItem.setColor(cartItemCreate.getColor());
            newItem.setSize(cartItemCreate.getSize());
            newItem.setQuantity(cartItemCreate.getQuantity());
            newItem.setAddedDateTime(LocalDateTime.now());
            savedItem = cartItemRepository.save(newItem);
        }

        actionLogService.logAction(
                customer.getUserId(),
                "CREATE",
                "CartItem",
                savedItem.getCartId(),
                "Added product to cart"
        );

        return "Product added to cart successfully";

    }

    @Override
    public CartItemDTO updateQuantity(String cartId, int quantity) {
        CartItem item = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));
        Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + item.getProductId()));
        item.setQuantity(quantity);

        Brand brand = brandRepository.findById(product.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + product.getBrandId()));
        Image image = imageRepository.findById(product.getMainImagesId().getFirst())
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + product.getMainImagesId().getFirst()));

        CartItem updatedItem = cartItemRepository.save(item);

        // Log the action
        actionLogService.logAction(
                item.getCustomerId(),
                "UPDATE",
                "CartItem",
                cartId,
                "Updated quantity of product in cart"
        );

        return CartItemMapper.convertToDTO(updatedItem, product, brand, image);    }

    @Override
    public void removeProduct(String cartId) {
        CartItem item = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        cartItemRepository.delete(item);

        actionLogService.logAction(
                item.getCustomerId(),
                "DELETE",
                "CartItem",
                cartId,
                "Removed product from cart"
        );
    }

    @Override
    public void clearCart() {
        User customer = userProvider.getAuthenticatedUser();
        cartItemRepository.deleteByCustomerId(customer.getUserId());

        actionLogService.logAction(
                customer.getUserId(),
                "DELETE",
                "CartItem",
                null,
                "Cleared all items from cart"
        );
    }
}