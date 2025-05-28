package com.fosso.backend.fosso_backend.image.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ImageStorageException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.image.service.ImageService;
import com.fosso.backend.fosso_backend.image.strategy.ImageDeletionHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandlerFactory;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ImageOwnerHandlerFactory handlerFactory;
    private final ActionLogService actionLogService;
    private final AuthenticatedUserProvider userProvider;


    @Override
    public Image uploadImage(MultipartFile file, String ownerId, ImageType type) {
        try {
            Image image = new Image();
            image.setImageId(UUID.randomUUID().toString());
            image.setContentType(file.getContentType());
            image.setFilename(file.getOriginalFilename());
            image.setData(new Binary(BsonBinarySubType.BINARY, file.getBytes()));
            image.setOwnerId(ownerId);
            image.setType(type);

            Image savedImage = imageRepository.save(image);

            ImageOwnerHandler handler = handlerFactory.getHandler(type);
            handler.handleImageAssociation(ownerId, savedImage.getImageId());

            actionLogService.logAction(
                    userProvider.getAuthenticatedUser().getUserId(),
                    "UPLOAD",
                    "Image",
                    savedImage.getImageId(),
                    "Uploaded an image of type: " + type
            );

            return savedImage;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    @Override
    public Image getImage(String ownerId, ImageType type) {
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
    public String deleteImage(String ownerId, String imageId, ImageType type) {
        if (!imageRepository.existsByOwnerIdAndImageIdAndType(ownerId, imageId, type)) {
            throw new ResourceNotFoundException("Image not found");
        }
        ImageDeletionHandler deletionHandler = handlerFactory.getDeletionHandler(type);

        deletionHandler.handleImageDeletion(ownerId, imageId);
        imageRepository.deleteByOwnerIdAndImageIdAndType(ownerId, imageId, type);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "DELETE",
                "Image",
                imageId,
                "Deleted an image of type: " + type
        );

        return "Image deleted successfully";
    }

    @Override
    public Image getImageById(String imageId, ImageType type) {
        return imageRepository.findByImageIdAndType(imageId, type)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
    }

    @Override
    public String uploadMainImages(String productId, MultipartFile[] mainImages, ImageType type) {
        for (MultipartFile file : mainImages) {
            try {
                Image image = new Image();
                image.setImageId(UUID.randomUUID().toString());
                image.setContentType(file.getContentType());
                image.setFilename(file.getOriginalFilename());
                image.setData(new Binary(BsonBinarySubType.BINARY, file.getBytes()));
                image.setOwnerId(productId);
                image.setType(type);

                imageRepository.save(image);

                actionLogService.logAction(
                        userProvider.getAuthenticatedUser().getUserId(),
                        "UPLOAD",
                        "Image",
                        image.getImageId(),
                        "Uploaded main images for product"
                );

            } catch (IOException | MongoException | IllegalArgumentException e) {
                throw new ImageStorageException("Failed to store image", e);
            }
        }

        return "Main images uploaded successfully";
    }

    @Override
    public String deleteImageById(String imageId) {
        imageRepository.deleteById(imageId);
        return "Image deleted successfully";
    }
}