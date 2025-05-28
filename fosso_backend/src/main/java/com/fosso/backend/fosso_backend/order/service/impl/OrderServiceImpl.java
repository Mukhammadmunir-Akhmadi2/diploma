package com.fosso.backend.fosso_backend.order.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.cart.model.CartItem;
import com.fosso.backend.fosso_backend.common.enums.OrderStatus;
import com.fosso.backend.fosso_backend.common.enums.PaymentMethod;
import com.fosso.backend.fosso_backend.common.exception.CartEmptyException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.image.mapper.ImageMapper;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.order.dto.CheckoutRequest;
import com.fosso.backend.fosso_backend.order.dto.OrderMerchantDTO;
import com.fosso.backend.fosso_backend.order.mapper.OrderMapper;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.model.OrderDetail;
import com.fosso.backend.fosso_backend.order.model.OrderTrack;
import com.fosso.backend.fosso_backend.product.model.Product;
import com.fosso.backend.fosso_backend.cart.repository.CartItemRepository;
import com.fosso.backend.fosso_backend.order.repository.OrderRepository;
import com.fosso.backend.fosso_backend.product.model.ProductVariant;
import com.fosso.backend.fosso_backend.product.repository.ProductRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.model.Address;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import com.fosso.backend.fosso_backend.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final AuthenticatedUserProvider userProvider;
    private final ActionLogService actionLogService;
    private final ImageRepository imageRepository;


    @Value("${telegram.webhook.url}")
    private String telegramWebhookUrl;
    @Value("${telegram.webhook.secret}")
    private String telegramWebhookSecret;

    public List<Order> listAll() {
        return orderRepository.findAll();
    }

    public Page<Order> listByPage(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return orderRepository.findByKeyword(keyword, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    public Order getOrder(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    public Order getByTrackingNumber(String trackingNumber) {
        return orderRepository.findByOrderTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with tracking number: " + trackingNumber));
    }

    public Page<Order> listByCustomer(String customerId, Pageable pageable) {
        Page<Order> orderPage = orderRepository.findByCustomerId(customerId, pageable);
        if (orderPage.isEmpty()){
            throw new ResourceNotFoundException("Order not found with customer ID: " + customerId);
        }
        return orderPage;
    }

    public Page<Order> listByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    public Order createOrder(CheckoutRequest checkoutRequest) {
        User customer = userProvider.getAuthenticatedUser();

        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customer.getUserId());
        if (cartItems.isEmpty()) {
            throw new CartEmptyException("Shopping cart is empty");
        }

        Order order = new Order();
        order.setOrderTrackingNumber(generateOrderTrackingNumber());
        order.setCustomerId(customer.getUserId());
        order.setStatus(OrderStatus.NEW);
        order.setPaymentMethod(checkoutRequest.getPaymentMethod());
        order.setOrderDateTime(LocalDateTime.now());
        for (Address address : customer.getAddresses()) {
            if (address.getAddressId().equals(checkoutRequest.getAddressId())) {
                order.setShippingAddress(address);
                break;
            }
        }
        if (order.getShippingAddress() == null) {
            throw new ResourceNotFoundException("Shipping address not found");
        }

        BigDecimal productCost = BigDecimal.ZERO;
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal shippingCost = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + item.getProductId()));

            User merchant = userRepository.findById(product.getMerchantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + product.getMerchantId()));

            ProductVariant matchingVariant = product.getProductVariants()
                    .stream()
                    .filter(variant ->
                            variant.getColor().equalsIgnoreCase(item.getColor()) &&
                                    variant.getSize().equalsIgnoreCase(item.getSize()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No product variant found with specified color and size."));

            if (matchingVariant.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock available for this product.");
            }
            matchingVariant.setStockQuantity(matchingVariant.getStockQuantity() - item.getQuantity());

            productRepository.save(product);

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setMerchantId(merchant.getUserId());
            orderDetail.setProductId(product.getProductId());
            orderDetail.setProductName(product.getProductName());

            orderDetail.setQuantity(item.getQuantity());

            orderDetail.setPrice(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice());
            orderDetail.setColor(item.getColor());
            orderDetail.setSize(item.getSize());

            orderDetail.setShippingCost(product.getShippingCost());

            BigDecimal itemSubtotal = orderDetail.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            orderDetail.setSubtotal(itemSubtotal);

            order.getOrderDetails().add(orderDetail);

            productCost = productCost.add(orderDetail.getPrice());
            subtotal = subtotal.add(itemSubtotal);
            shippingCost = shippingCost.add(product.getShippingCost());

            OrderTrack track = new OrderTrack();
            track.setStatus(OrderStatus.NEW);
            track.setUpdatedTime(LocalDate.now());
            track.setNotes("Order placed");

            orderDetail.setOrderTrack(track);
        }

        order.setProductsCost(productCost);
        order.setSubtotal(subtotal);

        if (subtotal.compareTo(new BigDecimal("100")) > 0) {
            shippingCost = BigDecimal.ZERO;
        }

        order.setShippingCost(shippingCost);

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.08"));
        order.setTax(tax);

        BigDecimal total = subtotal.add(shippingCost).add(tax);
        order.setTotal(total);

        order.setDeliveryDays(2);
        order.setDeliveryDate(LocalDate.now().plusDays(2));

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteByCustomerId(customer.getUserId());

        //notifyMerchantsViaBot(savedOrder);

        actionLogService.logAction(
                customer.getUserId(),
                "CREATE",
                "Order",
                savedOrder.getOrderTrackingNumber(),
                "Created a new order"
        );
        return savedOrder;
    }

    @Override
    public String cancelOrder(String orderId, String notes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResourceNotFoundException("Order is already cancelled");
        }
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new ResourceNotFoundException("Order cannot be cancelled after it has been shipped or delivered");
        }

        order.setStatus(OrderStatus.CANCELLED);

        for (OrderDetail orderDetail : order.getOrderDetails()) {
            if (orderDetail.getOrderTrack().getStatus() == OrderStatus.CANCELLED) {
                continue;
            }
            orderDetail.getOrderTrack().setStatus(OrderStatus.CANCELLED);
            orderDetail.getOrderTrack().setNotes(notes);
        }

        orderRepository.save(order);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "CANCEL",
                "Order",
                orderId,
                "Cancelled the order"
        );

        return "Order status updated successfully";
    }


    public Order updateStatus(String orderId, OrderStatus status, String notes) {
        if (status == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Order status cannot be updated to CANCELLED using this method.");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(status);

        for (OrderDetail orderDetail : order.getOrderDetails()) {
            if (orderDetail.getOrderTrack().getStatus() == OrderStatus.CANCELLED) {
                continue;
            }
            orderDetail.getOrderTrack().setStatus(status);
        }

        Order updatedOrder = orderRepository.save(order);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Order",
                orderId,
                "Updated order status to " + status
        );

        return updatedOrder;
    }

    @Override
    public Order updateProductStatus(String orderId, String productId, String color, String size, OrderStatus status, String notes) {
        if (status == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Order status cannot be updated to CANCELLED using this method.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        OrderDetail orderDetail = order.getOrderDetails().stream()
                .filter(detail -> detail.getProductId().equals(productId) &&
                        detail.getColor().equalsIgnoreCase(color) &&
                        detail.getSize().equalsIgnoreCase(size))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found in order"));

        if (orderDetail.getOrderTrack().getStatus() == OrderStatus.CANCELLED) {
            throw new ResourceNotFoundException("Product variant is already cancelled");
        }

        orderDetail.getOrderTrack().setStatus(status);
        orderDetail.getOrderTrack().setUpdatedTime(LocalDate.now());
        orderDetail.getOrderTrack().setNotes(notes);

        Set<OrderStatus> allStatuses = order.getOrderDetails().stream()
                .filter(detail -> detail.getOrderTrack().getStatus() != OrderStatus.CANCELLED)
                .map(detail -> detail.getOrderTrack().getStatus())
                .collect(Collectors.toSet());

        if (allStatuses.size() == 1) {
            order.setStatus(allStatuses.iterator().next());
        } else {
            order.setStatus(OrderStatus.PROCESSING);
        }

        Order updatedOrder = orderRepository.save(order);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Order",
                orderId,
                "Updated product variant status for product ID: " + productId + ", color: " + color + ", size: " + size + " to " + status
        );

        return updatedOrder;
    }


    public List<Order> findByDateRange(LocalDateTime  startDate, LocalDateTime  endDate) {
        return orderRepository.findByOrderTimeBetween(startDate, endDate);
    }

    private String generateOrderTrackingNumber() {
        return "SHP" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }


    public String cancelProductFromOrder(String orderId, String productId, String color, String size, String notes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        OrderDetail detailToRemove = order.getOrderDetails().stream()
                .filter(detail -> detail.getProductId().equals(productId) &&
                        detail.getColor().equalsIgnoreCase(color) &&
                        detail.getSize().equalsIgnoreCase(size))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found in order"));

        detailToRemove.getOrderTrack().setStatus(OrderStatus.CANCELLED);
        detailToRemove.getOrderTrack().setNotes(notes);

        order.setSubtotal(order.getSubtotal().subtract(detailToRemove.getSubtotal()));
        order.setShippingCost(order.getShippingCost().subtract(detailToRemove.getShippingCost()));

        BigDecimal tax = order.getSubtotal().multiply(new BigDecimal("0.10"));
        order.setTax(tax);
        BigDecimal total = order.getSubtotal().add(order.getShippingCost()).add(tax);
        order.setTotal(total);

        boolean allCancelled = order.getOrderDetails().stream()
                .allMatch(detail -> detail.getOrderTrack().getStatus() == OrderStatus.CANCELLED);

        if (allCancelled) {
            order.setStatus(OrderStatus.CANCELLED);
        }

        orderRepository.save(order);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "CANCEL",
                "Order",
                orderId,
                "Cancelled product variant with ID: " + productId + ", color: " + color + ", size: " + size + " from the order"
        );

        return "Product variant removed from order successfully";
    }

    public Page<OrderMerchantDTO> listByMerchant(Pageable pageable) {
        User user = userProvider.getAuthenticatedUser();
        Page<Order> orderPage = orderRepository.findByMerchantIdInOrderDetails(user.getUserId(), pageable);
        if (orderPage.isEmpty()) {
            throw new ResourceNotFoundException("Order not found for merchant: " + user.getEmail());
        }

        List<OrderMerchantDTO> filteredOrders = orderPage.getContent().stream()
                .flatMap(order -> {
                    List<OrderDetail> merchantOrderDetails = order.getOrderDetails().stream()
                            .filter(detail -> detail.getMerchantId().equals(user.getUserId()))
                            .collect(Collectors.toList());

                    if (merchantOrderDetails.isEmpty()) {
                        return Stream.empty();
                    }

                    return merchantOrderDetails.stream().map(orderDetail -> {
                        Product product = productRepository.findById(orderDetail.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + orderDetail.getProductId()));

                        Image image = imageRepository.findById(product.getMainImagesId().getFirst())
                                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + product.getMainImagesId().getFirst()));

                        return OrderMapper.convertToMerchantDTO(order, orderDetail, ImageMapper.convertToDTO(image));
                    });
                })
                .collect(Collectors.toList());

        return new PageImpl<>(filteredOrders, pageable, filteredOrders.size());
    }
}