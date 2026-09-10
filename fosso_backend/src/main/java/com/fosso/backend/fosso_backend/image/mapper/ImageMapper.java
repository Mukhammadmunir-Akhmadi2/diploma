package com.fosso.backend.fosso_backend.image.mapper;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.storage.ObjectStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ImageMapper {

    private final ObjectStorageService objectStorageService;

    public ImageDTO convertToDTO(Image image) {
        if (image == null) return null;

        return ImageDTO.builder()
                .imageId(image.getImageId())
                .contentType(image.getContentType())
                .filename(image.getFilename())
                .url(objectStorageService.buildPublicUrl(image.getObjectKey()))
                .build();
    }
}
