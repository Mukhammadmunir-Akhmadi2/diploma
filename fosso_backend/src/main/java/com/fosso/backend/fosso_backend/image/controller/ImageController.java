package com.fosso.backend.fosso_backend.image.controller;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.image.mapper.ImageMapper;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/user/{imageId}")
    public ResponseEntity<ImageDTO> getImageById(@PathVariable String imageId,
                                                 @RequestParam ImageType type) {
        Image image = imageService.getImageById(imageId, type);
        return ResponseEntity.ok().body(ImageMapper.convertToDTO(image));
    }

    @GetMapping("/user/owner/{ownerId}")
    public ResponseEntity<ImageDTO> getImageByOwnerId(
            @PathVariable String ownerId,
            @RequestParam ImageType imageType) {
        Image image = imageService.getImage(ownerId, imageType);
        return ResponseEntity.ok().body(ImageMapper.convertToDTO(image));
    }

    @PostMapping("/merchant/products/{productId}")
    public ResponseEntity<String> uploadProductImages(
            @PathVariable String productId,
            @RequestParam ImageType imageType,
            @RequestParam("images") MultipartFile[] images
    ) {
        return ResponseEntity.ok().body( imageService.uploadMainImages(productId, images, imageType));
    }

    @PostMapping("/merchant/{ownerId}/upload")
    public ResponseEntity<ImageDTO> uploadImage(
            @PathVariable String ownerId,
            @RequestParam ImageType imageType,
            @RequestParam("file") MultipartFile file) {
        Image image = imageService.uploadImage(file, ownerId, imageType);
        return ResponseEntity.ok(ImageMapper.convertToDTO(image));
    }

    @DeleteMapping("/merchant/{ownerId}/{imageId}/delete")
    public ResponseEntity<String> deleteImageByOwnerId(
            @PathVariable String ownerId,
            @PathVariable String imageId,
            @RequestParam ImageType type) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(imageService.deleteImage(ownerId, imageId, type));
    }

    @GetMapping("/user/{ownerId}/all")
    public ResponseEntity<List<ImageDTO>> getAllImagesForOwner(
            @PathVariable String ownerId,
            @RequestParam ImageType type) {
        List<Image> images = imageService.getAllImagesForOwner(ownerId, type);
        return ResponseEntity.ok(images.stream().map(ImageMapper::convertToDTO).toList());
    }
}