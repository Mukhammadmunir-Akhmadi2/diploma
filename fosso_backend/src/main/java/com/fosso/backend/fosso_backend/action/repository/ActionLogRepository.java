package com.fosso.backend.fosso_backend.action.repository;

import com.fosso.backend.fosso_backend.action.model.ActionLog;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActionLogRepository extends MongoRepository<ActionLog, String> {
    List<ActionLog> findByUserId(String userId, Sort sort);
    List<ActionLog> findByResource(String resource);
}