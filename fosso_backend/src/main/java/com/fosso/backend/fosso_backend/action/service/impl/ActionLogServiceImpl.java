package com.fosso.backend.fosso_backend.action.service.impl;

import com.fosso.backend.fosso_backend.action.model.ActionLog;
import com.fosso.backend.fosso_backend.action.repository.ActionLogRepository;
import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActionLogServiceImpl implements ActionLogService {
    private final ActionLogRepository actionLogRepository;

    @Override
    public ActionLog logAction(String userId, String action, String resource, String resourceId, String details) {
        ActionLog log = new ActionLog();
        log.setUserId(userId);
        log.setAction(action);
        log.setResource(resource);
        log.setResourceId(resourceId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        return actionLogRepository.save(log);
    }

    @Override
    public List<ActionLog> getLogsByUserId(String userId) {
        return actionLogRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    @Override
    public List<ActionLog> getLogsByResource(String resource) {
        return actionLogRepository.findByResource(resource);
    }

    @Override
    public List<ActionLog> getAllLogs() {
        return actionLogRepository.findAll();
    }
}
