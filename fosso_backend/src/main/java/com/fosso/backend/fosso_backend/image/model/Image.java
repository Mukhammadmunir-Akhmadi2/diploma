package com.fosso.backend.fosso_backend.image.model;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import lombok.Data;
import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "images")
public class Image implements LoggableEntity {
    @Id
    private String imageId;
    private Binary data;
    private String contentType;
    private String filename;
    private String ownerId; // userId or productId
    private ImageType type;

    @Override
    public String getEntityId() {
        return imageId;
    }
}
