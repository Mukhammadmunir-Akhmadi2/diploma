package com.fosso.backend.fosso_backend.action.controller;

import com.fosso.backend.fosso_backend.action.model.ActionLog;
import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actions")
@RequiredArgsConstructor
public class ActionController {

    private final ActionLogService actionLogService;

    @PostMapping("/log")
    public ResponseEntity<ActionLog> logAction(
            @RequestParam String userId,
            @RequestParam String action,
            @RequestParam String resource,
            @RequestParam String resourceId,
            @RequestParam(required = false) String details) {
        ActionLog log = actionLogService.logAction(userId, action, resource, resourceId, details);
        return ResponseEntity.ok(log);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActionLog>> getLogsByUserId(@PathVariable String userId) {
        List<ActionLog> logs = actionLogService.getLogsByUserId(userId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/resource/{resource}")
    public ResponseEntity<List<ActionLog>> getLogsByResource(@PathVariable String resource) {
        List<ActionLog> logs = actionLogService.getLogsByResource(resource);
        return ResponseEntity.ok(logs);
    }

    @GetMapping
    public ResponseEntity<List<ActionLog>> getAllLogs() {
        List<ActionLog> logs = actionLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
}