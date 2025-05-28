package com.fosso.backend.fosso_backend.brand.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Document(collection = "brands")
public class Brand {
    @Id
    private String brandId;

    @NotBlank(message = "Brand name is required")
    @Indexed(unique = true)
    private String name;
    private String description;
    private String logoImageId;
    private Set<String> categoryIds = new HashSet<>();
    private boolean enabled = true;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}