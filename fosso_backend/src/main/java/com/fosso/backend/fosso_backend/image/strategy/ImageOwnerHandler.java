package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;

public interface ImageOwnerHandler {
    boolean supports(ImageType type);
    void handleImageAssociation(String ownerId, String imageId);
}