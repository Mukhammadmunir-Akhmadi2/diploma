package com.fosso.backend.fosso_backend.image.storage;

import com.fosso.backend.fosso_backend.common.exception.ImageStorageException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketResponse;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutBucketPolicyRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class S3ObjectStorageServiceTest {

    @Mock
    private S3Client s3Client;

    private S3ObjectStorageService service;

    @BeforeEach
    void setUp() {
        service = new S3ObjectStorageService(s3Client, "fosso-images", "http://localhost:9000");
    }

    @Test
    void upload_putsObjectWithContentTypeAndReturnsObjectKey() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getSize()).thenReturn(4L);

        String result = service.upload("product_image/img-1", file);

        assertThat(result).isEqualTo("product_image/img-1");
        verify(s3Client).putObject(
                argThat((PutObjectRequest req) -> req.bucket().equals("fosso-images")
                        && req.key().equals("product_image/img-1")
                        && "image/png".equals(req.contentType())),
                any(RequestBody.class));
    }

    @Test
    void upload_wrapsIOExceptionInImageStorageException() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getInputStream()).thenThrow(new IOException("boom"));

        assertThatThrownBy(() -> service.upload("product_image/img-1", file))
                .isInstanceOf(ImageStorageException.class);
    }

    @Test
    void upload_wrapsS3ExceptionInImageStorageException() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getContentType()).thenReturn("image/png");
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getSize()).thenReturn(4L);
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenThrow(S3Exception.builder().message("boom").build());

        assertThatThrownBy(() -> service.upload("product_image/img-1", file))
                .isInstanceOf(ImageStorageException.class);
    }

    @Test
    void delete_deletesObjectFromBucket() {
        service.delete("product_image/img-1");

        verify(s3Client).deleteObject(DeleteObjectRequest.builder()
                .bucket("fosso-images")
                .key("product_image/img-1")
                .build());
    }

    @Test
    void delete_wrapsS3ExceptionInImageStorageException() {
        when(s3Client.deleteObject(any(DeleteObjectRequest.class)))
                .thenThrow(S3Exception.builder().message("boom").build());

        assertThatThrownBy(() -> service.delete("product_image/img-1"))
                .isInstanceOf(ImageStorageException.class);
    }

    @Test
    void buildPublicUrl_composesFromPublicUrlBucketAndKey() {
        String url = service.buildPublicUrl("product_image/img-1");

        assertThat(url).isEqualTo("http://localhost:9000/fosso-images/product_image/img-1");
    }

    @Test
    void ensureBucketExists_createsBucketAndAppliesPublicReadPolicyWhenMissing() {
        when(s3Client.headBucket(any(HeadBucketRequest.class)))
                .thenThrow(NoSuchBucketException.builder().message("no bucket").build());

        service.ensureBucketExists();

        verify(s3Client).createBucket(CreateBucketRequest.builder().bucket("fosso-images").build());
        verify(s3Client).putBucketPolicy(any(PutBucketPolicyRequest.class));
    }

    @Test
    void ensureBucketExists_doesNothingWhenBucketAlreadyExists() {
        when(s3Client.headBucket(any(HeadBucketRequest.class)))
                .thenReturn(HeadBucketResponse.builder().build());

        service.ensureBucketExists();

        verify(s3Client, never()).createBucket(any(CreateBucketRequest.class));
    }

    @Test
    void ensureBucketExists_createsBucketWhenHeadBucketReturnsGeneric404() {
        when(s3Client.headBucket(any(HeadBucketRequest.class)))
                .thenThrow(S3Exception.builder().statusCode(404).message("not found").build());

        service.ensureBucketExists();

        verify(s3Client).createBucket(CreateBucketRequest.builder().bucket("fosso-images").build());
        verify(s3Client).putBucketPolicy(any(PutBucketPolicyRequest.class));
    }

    @Test
    void ensureBucketExists_doesNotCreateBucketOnNonNotFoundS3Exception() {
        when(s3Client.headBucket(any(HeadBucketRequest.class)))
                .thenThrow(S3Exception.builder().statusCode(403).message("forbidden").build());

        service.ensureBucketExists();

        verify(s3Client, never()).createBucket(any(CreateBucketRequest.class));
    }

    @Test
    void ensureBucketExists_doesNotThrowWhenObjectStorageUnreachable() {
        when(s3Client.headBucket(any(HeadBucketRequest.class)))
                .thenThrow(SdkClientException.create("Connection refused"));

        service.ensureBucketExists();

        verify(s3Client, never()).createBucket(any(CreateBucketRequest.class));
    }
}
