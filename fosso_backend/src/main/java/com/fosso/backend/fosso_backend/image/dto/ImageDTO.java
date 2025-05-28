package com.fosso.backend.fosso_backend.image.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageDTO {
    private String imageId;
    private String contentType;
    private String filename;
    private String base64Data;
}