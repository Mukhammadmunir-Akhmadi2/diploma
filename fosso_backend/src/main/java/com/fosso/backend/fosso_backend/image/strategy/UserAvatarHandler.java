package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserAvatarHandler implements ImageOwnerHandler {

    private final UserService userService;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.USER_AVATAR;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        userService.attachAvatar(ownerId, imageId);
    }
}
