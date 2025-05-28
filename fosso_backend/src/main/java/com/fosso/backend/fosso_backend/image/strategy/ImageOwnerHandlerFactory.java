package com.fosso.backend.fosso_backend.image.strategy;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ImageOwnerHandlerFactory {

    private final List<ImageOwnerHandler> handlers;
    private final List<ImageDeletionHandler> deletionHandlers;


    public ImageOwnerHandler getHandler(ImageType type) {
        return handlers.stream()
                .filter(handler -> handler.supports(type))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No handler for type: " + type));
    }

    public ImageDeletionHandler getDeletionHandler(ImageType type) {
        return deletionHandlers.stream()
                .filter(handler -> handler.supports(type))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No handler for type: " + type));
    }
}