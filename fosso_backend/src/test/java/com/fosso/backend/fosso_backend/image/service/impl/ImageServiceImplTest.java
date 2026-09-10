package com.fosso.backend.fosso_backend.image.service.impl;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.image.storage.ObjectStorageService;
import com.fosso.backend.fosso_backend.image.strategy.ImageDeletionHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandler;
import com.fosso.backend.fosso_backend.image.strategy.ImageOwnerHandlerFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageServiceImplTest {

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ImageOwnerHandlerFactory handlerFactory;

    @Mock
    private ObjectStorageService objectStorageService;

    @Mock
    private ImageOwnerHandler imageOwnerHandler;

    @Mock
    private ImageDeletionHandler imageDeletionHandler;

    @InjectMocks
    private ImageServiceImpl imageService;

    @Test
    void uploadImage_uploadsToStorageSavesObjectKeyAndAssociatesOwner() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getOriginalFilename()).thenReturn("logo.png");
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(handlerFactory.getHandler(ImageType.BRAND_IMAGE)).thenReturn(imageOwnerHandler);

        Image result = imageService.uploadImage(file, "brand-1", ImageType.BRAND_IMAGE);

        assertThat(result.getObjectKey()).startsWith("brand_image/");
        assertThat(result.getOwnerId()).isEqualTo("brand-1");
        verify(objectStorageService).upload(result.getObjectKey(), file);
        verify(imageOwnerHandler).handleImageAssociation("brand-1", result.getImageId());
    }

    @Test
    void deleteImage_deletesFromStorageAndRepositoryAndInvokesHandler() {
        Image image = new Image();
        image.setImageId("image-1");
        image.setOwnerId("brand-1");
        image.setObjectKey("brand_image/image-1");
        when(imageRepository.findByImageIdAndType("image-1", ImageType.BRAND_IMAGE)).thenReturn(Optional.of(image));
        when(handlerFactory.getDeletionHandler(ImageType.BRAND_IMAGE)).thenReturn(imageDeletionHandler);

        String result = imageService.deleteImage("brand-1", "image-1", ImageType.BRAND_IMAGE);

        assertThat(result).isEqualTo("Image deleted successfully");
        verify(imageDeletionHandler).handleImageDeletion("brand-1", "image-1");
        verify(objectStorageService).delete("brand_image/image-1");
        verify(imageRepository).deleteByOwnerIdAndImageIdAndType("brand-1", "image-1", ImageType.BRAND_IMAGE);
    }

    @Test
    void deleteImage_throwsWhenImageNotFound() {
        when(imageRepository.findByImageIdAndType("missing", ImageType.BRAND_IMAGE)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> imageService.deleteImage("brand-1", "missing", ImageType.BRAND_IMAGE))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteImage_throwsWhenOwnerDoesNotMatch() {
        Image image = new Image();
        image.setImageId("image-1");
        image.setOwnerId("other-owner");
        when(imageRepository.findByImageIdAndType("image-1", ImageType.BRAND_IMAGE)).thenReturn(Optional.of(image));

        assertThatThrownBy(() -> imageService.deleteImage("brand-1", "image-1", ImageType.BRAND_IMAGE))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
