package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserAvatarDeletionHandlerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserAvatarDeletionHandler userAvatarDeletionHandler;

    @Test
    void supports_returnsTrueOnlyForUserAvatar() {
        assertThat(userAvatarDeletionHandler.supports(ImageType.USER_AVATAR)).isTrue();
        assertThat(userAvatarDeletionHandler.supports(ImageType.BRAND_IMAGE)).isFalse();
    }

    @Test
    void handleImageDeletion_delegatesToUserService() {
        userAvatarDeletionHandler.handleImageDeletion("user-1", "image-1");

        verify(userService).clearAvatar("user-1");
    }
}
