package com.fosso.backend.fosso_backend.brand.model;

import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "brands")
public class Brand implements LoggableEntity {
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

    @Override
    public String getEntityId() {
        return brandId;
    }
}