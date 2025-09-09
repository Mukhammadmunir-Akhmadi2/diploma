package com.fosso.backend.fosso_backend.image.mapper;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.image.model.Image;

import java.util.Base64;

public class ImageMapper {
    public static ImageDTO convertToDTO(Image image) {
        if (image == null) return null;

        return ImageDTO.builder()
                .imageId(image.getImageId())
                .contentType(image.getContentType())
                .filename(image.getFilename())
                .base64Data(Base64.getEncoder().encodeToString(image.getData().getData()))
                .build();
    }
}
