package com.fosso.backend.fosso_backend.image.repository;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.image.model.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends MongoRepository<Image, String> {
    Optional<Image> findFirstByOwnerIdAndType(String ownerId, ImageType type);

    Optional<Image> findByImageIdAndType(String imageId, ImageType type);

    List<Image> findAllByOwnerId(String ownerId);

    @Query("{'ownerId': ?0, 'imageId': ?1, 'type': ?2}")
    Image deleteByOwnerIdAndImageIdAndType(String ownerId, String imageId, ImageType type);

    Boolean existsByOwnerIdAndImageIdAndType(String ownerId, String imageId, ImageType type);
}