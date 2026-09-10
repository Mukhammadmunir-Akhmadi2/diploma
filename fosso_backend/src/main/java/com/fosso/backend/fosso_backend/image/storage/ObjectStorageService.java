package com.fosso.backend.fosso_backend.image.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {
    String upload(String objectKey, MultipartFile file);
    void delete(String objectKey);
    String buildPublicUrl(String objectKey);
}
