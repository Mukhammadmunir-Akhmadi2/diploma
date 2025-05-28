package com.fosso.backend.fosso_backend.action.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "user_action_logs")
public class ActionLog {
    @Id
    private String actionId;
    private String userId;
    private String action;
    private String resource;
    private String resourceId;
    private String details;
    private LocalDateTime timestamp;
}