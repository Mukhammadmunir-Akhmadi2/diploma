package com.fosso.backend.fosso_backend.config;

import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private SecurityConfig securityConfig;

    @Test
    void userDetailsService_loadsUserThroughUserService() {
        User user = new User();
        user.setEmail("jane@example.com");
        when(userService.getUserByEmail("jane@example.com")).thenReturn(Optional.of(user));

        UserDetailsService userDetailsService = securityConfig.userDetailsService();
        UserDetails result = userDetailsService.loadUserByUsername("jane@example.com");

        assertThat(result).isEqualTo(user);
    }

    @Test
    void userDetailsService_throwsWhenUserNotFound() {
        when(userService.getUserByEmail("missing@example.com")).thenReturn(Optional.empty());

        UserDetailsService userDetailsService = securityConfig.userDetailsService();

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("missing@example.com"))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}
