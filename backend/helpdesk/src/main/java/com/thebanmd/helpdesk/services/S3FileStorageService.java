package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.exceptions.AttachmentNotFoundException;
import com.thebanmd.helpdesk.exceptions.StorageUnavailableException;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.checksums.ResponseChecksumValidation;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;

/**
 * Sparar filer i en S3-kompatibel bucket, i vårt fall Backblaze B2 (beslut 11).
 * Uppgifterna läses från .env (S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY,
 * S3_SECRET_KEY). Saknas de startar backend ändå, men uppladdning svarar 503.
 */
@Service
public class S3FileStorageService implements FileStorageService {

    private static final String NOT_CONFIGURED =
            "Fillagringen är inte inställd. Lägg till S3-raderna i backend/helpdesk/.env.";

    private final S3Client client; // null om .env saknar S3-uppgifterna
    private final String bucket;

    public S3FileStorageService(
            @Value("${storage.s3.endpoint}") String endpoint,
            @Value("${storage.s3.region}") String region,
            @Value("${storage.s3.bucket}") String bucket,
            @Value("${storage.s3.access-key}") String accessKey,
            @Value("${storage.s3.secret-key}") String secretKey) {
        this.bucket = bucket;
        boolean configured = !endpoint.isBlank() && !bucket.isBlank()
                && !accessKey.isBlank() && !secretKey.isBlank();
        this.client = configured
                ? S3Client.builder()
                        .endpointOverride(URI.create(endpoint))
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)))
                        .forcePathStyle(true)
                        // B2 stöder inte alla kontrollsummor som nyare AWS SDK skickar som standard.
                        .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                        .responseChecksumValidation(ResponseChecksumValidation.WHEN_REQUIRED)
                        .build()
                : null;
    }

    @Override
    public void save(String key, byte[] content, String contentType) {
        try {
            client().putObject(
                    PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
                    RequestBody.fromBytes(content));
        } catch (SdkException e) {
            throw new StorageUnavailableException("Kunde inte spara filen i fillagringen.", e);
        }
    }

    @Override
    public byte[] load(String key) {
        try {
            return client().getObjectAsBytes(
                    GetObjectRequest.builder().bucket(bucket).key(key).build()).asByteArray();
        } catch (NoSuchKeyException e) {
            throw new AttachmentNotFoundException("Bilden finns inte i fillagringen");
        } catch (SdkException e) {
            throw new StorageUnavailableException("Kunde inte hämta filen från fillagringen.", e);
        }
    }

    @Override
    public void delete(String key) {
        try {
            client().deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (SdkException e) {
            throw new StorageUnavailableException("Kunde inte ta bort filen i fillagringen.", e);
        }
    }

    private S3Client client() {
        if (client == null) {
            throw new StorageUnavailableException(NOT_CONFIGURED, null);
        }
        return client;
    }

    @PreDestroy
    void close() {
        if (client != null) {
            client.close();
        }
    }
}
