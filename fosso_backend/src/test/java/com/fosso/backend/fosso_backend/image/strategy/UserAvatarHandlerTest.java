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
class UserAvatarHandlerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserAvatarHandler userAvatarHandler;

    @Test
    void supports_returnsTrueOnlyForUserAvatar() {
        assertThat(userAvatarHandler.supports(ImageType.USER_AVATAR)).isTrue();
        assertThat(userAvatarHandler.supports(ImageType.BRAND_IMAGE)).isFalse();
    }

    @Test
    void handleImageAssociation_delegatesToUserService() {
        userAvatarHandler.handleImageAssociation("user-1", "image-1");

        verify(userService).attachAvatar("user-1", "image-1");
    }
}
