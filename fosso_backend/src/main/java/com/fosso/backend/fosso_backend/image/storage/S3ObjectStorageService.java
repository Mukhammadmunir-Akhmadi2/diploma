package com.fosso.backend.fosso_backend.image.storage;

import com.fosso.backend.fosso_backend.common.exception.ImageStorageException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutBucketPolicyRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;

@Service
public class S3ObjectStorageService implements ObjectStorageService {

    private static final Logger log = LoggerFactory.getLogger(S3ObjectStorageService.class);

    private final S3Client s3Client;
    private final String bucket;
    private final String publicUrl;

    public S3ObjectStorageService(
            S3Client s3Client,
            @Value("${app.s3.bucket}") String bucket,
            @Value("${app.s3.public-url}") String publicUrl) {
        this.s3Client = s3Client;
        this.bucket = bucket;
        this.publicUrl = publicUrl;
    }

    @PostConstruct
    public void ensureBucketExists() {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
        } catch (NoSuchBucketException e) {
            createBucketWithPublicReadPolicy();
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                createBucketWithPublicReadPolicy();
            } else {
                log.warn("Could not verify S3 bucket '{}' at startup: {}", bucket, e.getMessage());
            }
        } catch (SdkException e) {
            log.warn("Could not reach object storage at startup to verify bucket '{}': {}", bucket, e.getMessage());
        }
    }

    private void createBucketWithPublicReadPolicy() {
        s3Client.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
        s3Client.putBucketPolicy(PutBucketPolicyRequest.builder()
                .bucket(bucket)
                .policy(publicReadPolicy())
                .build());
    }

    @Override
    public String upload(String objectKey, MultipartFile file) {
        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(objectKey)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return objectKey;
        } catch (IOException | S3Exception e) {
            throw new ImageStorageException("Failed to upload image to object storage", e);
        }
    }

    @Override
    public void delete(String objectKey) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(objectKey).build());
        } catch (S3Exception e) {
            throw new ImageStorageException("Failed to delete image from object storage", e);
        }
    }

    @Override
    public String buildPublicUrl(String objectKey) {
        return publicUrl + "/" + bucket + "/" + objectKey;
    }

    private String publicReadPolicy() {
        return """
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Effect": "Allow",
                      "Principal": "*",
                      "Action": "s3:GetObject",
                      "Resource": "arn:aws:s3:::%s/*"
                    }
                  ]
                }
                """.formatted(bucket);
    }
}
