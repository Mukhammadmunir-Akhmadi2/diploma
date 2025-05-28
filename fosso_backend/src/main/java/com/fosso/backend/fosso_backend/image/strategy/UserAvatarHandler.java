package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserAvatarHandler implements ImageOwnerHandler {

    private final UserRepository userRepository;

    @Override
    public boolean supports(ImageType type) {
        return type == ImageType.USER_AVATAR;
    }

    @Override
    public void handleImageAssociation(String ownerId, String imageId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setImageId(imageId);
        userRepository.save(user);
    }
}