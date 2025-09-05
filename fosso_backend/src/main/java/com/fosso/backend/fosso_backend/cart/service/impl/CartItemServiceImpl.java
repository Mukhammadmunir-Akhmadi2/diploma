package com.fosso.backend.fosso_backend.cart.service.impl;

import com.fosso.backend.fosso_backend.brand.model.Brand;
import com.fosso.backend.fosso_backend.brand.service.BrandService;
import com.fosso.backend.fosso_backend.cart.dto.CartItemCreateDTO;
import com.fosso.backend.fosso_backend.cart.dto.CartItemDTO;
import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.cart.mapper.CartItemMapper;
import com.fosso.backend.fosso_backend.cart.model.CartItem;
import com.fosso.backend.fosso_backend.common.exception.UnauthorizedException;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.service.ImageService;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.product.model.ProductVariant;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.cart.repository.CartItemRepository;
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
    private final ProductService productService;
    private final AuthenticatedUserProvider userProvider;
    private final BrandService brandService;
    private final ImageService imageService;

    @Override
    public List<CartItemDTO> listCartItems(String customerId) {
        User currentUser = userProvider.getAuthenticatedUser();
        if (!currentUser.getUserId().equals(customerId)) {
            throw new UnauthorizedException("You are not authorized to view this cart");
        }
        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new ResourceNotFoundException("No cart item found with id " + customerId);
        }
        return cartItems.stream().map(cartItem -> {
            Product product = productService.getProductById(cartItem.getProductId());

            Brand brand = brandService.getByBrandId(product.getBrandId());

            Image image = imageService.getImageById(product.getMainImagesId().getFirst());

            return CartItemMapper.convertToDTO(cartItem, product, brand, image);
        }).toList();
    }

    @Override
    @Loggable(action = "CREATE", entity = "CartItem", message = "Added product to cart")
    public CartItem addProduct(CartItemCreateDTO cartItemCreate) {
        User customer = userProvider.getAuthenticatedUser();

        Product product = productService.getProductById(cartItemCreate.getProductId());

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
        return savedItem;

    }

    @Override
    @Loggable(action = "UPDATE", entity = "CartItem", message = "Updated quantity of product in cart")
    public CartItemDTO updateQuantity(String cartId, int quantity) {
        CartItem item = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));
        Product product = productService.getProductById(item.getProductId());

        item.setQuantity(quantity);

        Brand brand = brandService.getByBrandId(product.getBrandId());

        Image image = imageService.getImageById(product.getMainImagesId().getFirst());

        CartItem updatedItem = cartItemRepository.save(item);

        return CartItemMapper.convertToDTO(updatedItem, product, brand, image);    }

    @Override
    @Loggable(action = "DELETE", entity = "CartItem", message = "Removed product from cart")
    public void removeProduct(String cartId) {
        CartItem item = cartItemRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        cartItemRepository.delete(item);
    }

    @Override
    @Loggable(action = "DELETE", entity = "CartItem", message = "Cleared all items from cart")
    public void clearCart() {
        User customer = userProvider.getAuthenticatedUser();
        cartItemRepository.deleteByCustomerId(customer.getUserId());
    }

    @Override
    public List<CartItem> getByCustomerId(String userId) {
        return cartItemRepository.findByCustomerId(userId);
    }

    @Override
    public void deleteByCustomerId(String userId) {
        cartItemRepository.deleteByCustomerId(userId);
    }
}