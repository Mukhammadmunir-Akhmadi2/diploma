package com.fosso.backend.fosso_backend.common.aop;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.product.model.Product;
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
    private ActionLogService logService;
    private AuthenticatedUserProvider userProvider;



    @Around("@annotation(logAction)")
    public Object loggerAction(ProceedingJoinPoint joinPoint, LogAction logAction) throws Throwable {
        User currentUser = userProvider.getAuthenticatedUser();
        String entityId = "";
        try {
            Object result = joinPoint.proceed();

            Object firstArg = joinPoint.getArgs()[0];
            if (firstArg instanceof String) {
                entityId = (String) firstArg;
            } else if (result instanceof Product) {
                entityId = ((Product) result).getProductId();
            }

            logService.logAction(
                    currentUser.getUserId(),
                    logAction.action(),
                    logAction.entity(),
                    entityId,
                    logAction.message()
            );

            return result;
        } catch (Throwable ex) {
            // Optional: log failed action if you want
            logService.logAction(
                    currentUser.getUserId(),
                    "FAILED_" + logAction.action(),
                    logAction.entity(),
                    entityId,
                    "Failed due to: " + ex.getMessage()
            );
            throw ex;
        }
    }

}
