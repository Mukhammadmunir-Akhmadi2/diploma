package com.fosso.backend.fosso_backend.order.service.impl;

import com.fosso.backend.fosso_backend.cart.service.CartItemService;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.repository.OrderRepository;
import com.fosso.backend.fosso_backend.product.service.ProductService;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplGetByCustomerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @Mock
    private CartItemService cartItemService;

    @Mock
    private AuthenticatedUserProvider userProvider;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void getOrdersByCustomerId_returnsAllOrdersForCustomer() {
        Order order1 = new Order();
        order1.setOrderId("order-1");
        Order order2 = new Order();
        order2.setOrderId("order-2");
        when(orderRepository.findByCustomerId("customer-1")).thenReturn(List.of(order1, order2));

        List<Order> result = orderService.getOrdersByCustomerId("customer-1");

        assertThat(result).containsExactly(order1, order2);
    }

    @Test
    void getOrdersByCustomerId_returnsEmptyListWhenNoOrders() {
        when(orderRepository.findByCustomerId("customer-2")).thenReturn(List.of());

        List<Order> result = orderService.getOrdersByCustomerId("customer-2");

        assertThat(result).isEmpty();
    }
}
