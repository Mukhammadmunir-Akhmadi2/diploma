package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;

public interface ImageDeletionHandler {
    boolean supports(ImageType type);
    void handleImageDeletion(String ownerId, String imageId);
}