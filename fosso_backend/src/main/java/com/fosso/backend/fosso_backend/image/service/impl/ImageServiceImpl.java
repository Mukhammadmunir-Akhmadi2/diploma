package com.fosso.backend.fosso_backend.image.service.impl;

import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ImageStorageException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.image.service.ImageService;
import com.fosso.backend.fosso_backend.image.storage.ObjectStorageService;
import com.fosso.backend.fosso_backend.image.strategy.ImageDeletionHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandlerFactory;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ImageOwnerHandlerFactory handlerFactory;
    private final ObjectStorageService objectStorageService;

    @Override
    @Loggable(action = "UPLOAD", entity = "Image", message = "Uploaded the image")
    public Image uploadImage(MultipartFile file, String ownerId, ImageType type) {
        Image savedImage = imageRepository.save(buildImage(ownerId, type, file));

        ImageOwnerHandler handler = handlerFactory.getHandler(type);
        handler.handleImageAssociation(ownerId, savedImage.getImageId());

        return savedImage;
    }

    @Override
    public Image getOwnerImage(String ownerId, ImageType type) {
        return imageRepository.findFirstByOwnerIdAndType(ownerId, type)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
    }

    @Override
    public List<Image> getAllImagesForOwner(String ownerId, ImageType type) {
        return imageRepository.findAllByOwnerId(ownerId)
                .stream()
                .filter(image -> image.getType().equals(type))
                .toList();
    }

    @Override
    @Loggable(action = "DELETE", entity = "Image", message = "Deleted the image")
    public String deleteImage(String ownerId, String imageId, ImageType type) {
        Image image = imageRepository.findByImageIdAndType(imageId, type)
                .filter(existing -> existing.getOwnerId().equals(ownerId))
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        ImageDeletionHandler deletionHandler = handlerFactory.getDeletionHandler(type);
        deletionHandler.handleImageDeletion(ownerId, imageId);

        objectStorageService.delete(image.getObjectKey());
        imageRepository.deleteByOwnerIdAndImageIdAndType(ownerId, imageId, type);

        return "Image deleted successfully";
    }

    @Override
    public Image getImageById(String imageId, ImageType type) {
        return imageRepository.findByImageIdAndType(imageId, type)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
    }

    @Override
    public Image getImageById(String imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));
    }

    @Override
    @Loggable(action = "UPLOAD", entity = "Image", message = "Uploaded main images for product")
    public String uploadMainImages(String productId, MultipartFile[] mainImages, ImageType type) {
        for (MultipartFile file : mainImages) {
            try {
                imageRepository.save(buildImage(productId, type, file));
            } catch (MongoException | IllegalArgumentException e) {
                throw new ImageStorageException("Failed to store image", e);
            }
        }

        return "Main images uploaded successfully";
    }

    private Image buildImage(String ownerId, ImageType type, MultipartFile file) {
        String imageId = UUID.randomUUID().toString();
        String objectKey = type.name().toLowerCase() + "/" + imageId;
        objectStorageService.upload(objectKey, file);

        Image image = new Image();
        image.setImageId(imageId);
        image.setContentType(file.getContentType());
        image.setFilename(file.getOriginalFilename());
        image.setObjectKey(objectKey);
        image.setOwnerId(ownerId);
        image.setType(type);
        return image;
    }
}