package com.fosso.backend.fosso_backend.action.service;

import com.fosso.backend.fosso_backend.action.model.ActionLog;

import java.util.List;

public interface ActionLogService {
    ActionLog logAction(String userId, String action, String resource, String resourceId, String details);
    List<ActionLog> getLogsByUserId(String userId);
    List<ActionLog> getLogsByResource(String resource);
    List<ActionLog> getAllLogs();
}
