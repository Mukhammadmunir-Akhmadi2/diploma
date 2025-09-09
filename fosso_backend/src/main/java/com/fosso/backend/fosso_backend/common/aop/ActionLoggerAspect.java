package com.fosso.backend.fosso_backend.common.aop;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.common.interfaces.LoggableEntity;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class ActionLoggerAspect {

    private final ActionLogService logService;
    private final AuthenticatedUserProvider userProvider;



    @Around("@annotation(loggable)")
    public Object loggerAction(ProceedingJoinPoint joinPoint, Loggable loggable) throws Throwable {
        User currentUser = userProvider.getAuthenticatedUser();
        String entityId = "";
        try {
            Object result = joinPoint.proceed();

            Object firstArg = joinPoint.getArgs()[0];
            if (firstArg instanceof String) {
                entityId = (String) firstArg;
            } else if (result instanceof LoggableEntity) {
                entityId = ((LoggableEntity) result).getEntityId();
            }

            logService.logAction(
                    currentUser.getUserId(),
                    loggable.action(),
                    loggable.entity(),
                    entityId,
                    loggable.message()
            );

            return result;
        } catch (Throwable ex) {
            logService.logAction(
                    currentUser.getUserId(),
                    "FAILED_" + loggable.action(),
                    loggable.entity(),
                    entityId,
                    "Failed due to: " + ex.getMessage()
            );
            throw ex;
        }
    }

}
