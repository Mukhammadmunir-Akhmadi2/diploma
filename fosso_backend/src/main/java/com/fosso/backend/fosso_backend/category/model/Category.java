package com.fosso.backend.fosso_backend.category.model;

import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "categories")
public class Category implements LoggableEntity {
    @Id
    private String categoryId;
    @Indexed(unique = true)
    private String name;
    private String imageId;
    private boolean enabled = true;
    private String parentId;
    private String parentName;
    private Set<String> children = new HashSet<>();
    private int level;
    private String allParentIDs;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;

    @Override
    public String getEntityId() {
        return categoryId;
    }
}