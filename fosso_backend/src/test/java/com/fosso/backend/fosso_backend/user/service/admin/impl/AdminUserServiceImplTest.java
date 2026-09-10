package com.fosso.backend.fosso_backend.user.service.admin.impl;

import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.service.OrderService;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserDetailDTO;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import com.fosso.backend.fosso_backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private AuthenticatedUserProvider userProvider;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private AdminUserServiceImpl adminUserService;

    @Test
    void getUserById_computesOrderCountAndTotalSpendFromOrderService() {
        User user = new User();
        user.setUserId("user-1");
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

        Order order1 = new Order();
        order1.setTotal(new BigDecimal("50.00"));
        Order order2 = new Order();
        order2.setTotal(new BigDecimal("25.50"));
        when(orderService.getOrdersByCustomerId("user-1")).thenReturn(List.of(order1, order2));

        AdminUserDetailDTO result = adminUserService.getUserById("user-1");

        assertThat(result.getOrderCount()).isEqualTo(2);
        assertThat(result.getTotalSpent()).isEqualByComparingTo(new BigDecimal("75.50"));
    }

    @Test
    void getUserById_handlesCustomerWithNoOrders() {
        User user = new User();
        user.setUserId("user-2");
        when(userRepository.findById("user-2")).thenReturn(Optional.of(user));
        when(orderService.getOrdersByCustomerId("user-2")).thenReturn(List.of());

        AdminUserDetailDTO result = adminUserService.getUserById("user-2");

        assertThat(result.getOrderCount()).isEqualTo(0);
        assertThat(result.getTotalSpent()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
