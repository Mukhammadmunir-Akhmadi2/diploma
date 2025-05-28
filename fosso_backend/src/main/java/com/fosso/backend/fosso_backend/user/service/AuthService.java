package com.fosso.backend.fosso_backend.user.service;

import com.fosso.backend.fosso_backend.user.dto.AuthRequest;
import com.fosso.backend.fosso_backend.user.dto.RegisterRequest;

public interface AuthService {
    String login(AuthRequest authRequest);
    String register(RegisterRequest registerRequest);
}
