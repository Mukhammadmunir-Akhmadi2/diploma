package com.fosso.backend.fosso_backend.user.service.impl;

import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplAvatarTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticatedUserProvider userProvider;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void attachAvatar_setsImageIdAndSaves() {
        User user = new User();
        user.setUserId("user-1");
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.attachAvatar("user-1", "image-1");

        assertThat(user.getImageId()).isEqualTo("image-1");
        verify(userRepository).save(user);
    }

    @Test
    void attachAvatar_throwsWhenUserNotFound() {
        when(userRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.attachAvatar("missing", "image-1"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void clearAvatar_setsImageIdToNullAndSaves() {
        User user = new User();
        user.setUserId("user-1");
        user.setImageId("image-1");
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.clearAvatar("user-1");

        assertThat(user.getImageId()).isNull();
        verify(userRepository).save(user);
    }
}
