package com.fosso.backend.fosso_backend.image.mapper;

import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.storage.ObjectStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageMapperTest {

    @Mock
    private ObjectStorageService objectStorageService;

    @InjectMocks
    private ImageMapper imageMapper;

    @Test
    void convertToDTO_returnsNullForNullImage() {
        assertThat(imageMapper.convertToDTO(null)).isNull();
    }

    @Test
    void convertToDTO_mapsFieldsAndBuildsUrlFromObjectStorage() {
        Image image = new Image();
        image.setImageId("image-1");
        image.setContentType("image/png");
        image.setFilename("logo.png");
        image.setObjectKey("brand_image/image-1");
        when(objectStorageService.buildPublicUrl("brand_image/image-1"))
                .thenReturn("http://localhost:9000/fosso-images/brand_image/image-1");

        ImageDTO dto = imageMapper.convertToDTO(image);

        assertThat(dto.getImageId()).isEqualTo("image-1");
        assertThat(dto.getContentType()).isEqualTo("image/png");
        assertThat(dto.getFilename()).isEqualTo("logo.png");
        assertThat(dto.getUrl()).isEqualTo("http://localhost:9000/fosso-images/brand_image/image-1");
    }
}
