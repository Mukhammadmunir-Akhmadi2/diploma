package com.fosso.backend.fosso_backend.image.service;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.image.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    Image uploadImage(MultipartFile file, String ownerId, ImageType type);
    Image getImage(String ownerId, ImageType type);
    List<Image> getAllImagesForOwner(String ownerId, ImageType type);
    String deleteImage(String ownerId, String imageId, ImageType type);
    Image getImageById(String imageId, ImageType type);
    String uploadMainImages(String productId, MultipartFile[] mainImages, ImageType type);
    String deleteImageById(String imageId);
}
