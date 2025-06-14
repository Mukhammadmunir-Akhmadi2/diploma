package com.fosso.backend.fosso_backend.user.service.impl;

import com.fosso.backend.fosso_backend.user.dto.AuthRequest;
import com.fosso.backend.fosso_backend.user.dto.RegisterRequest;

import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.user.mapper.UserMapper;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.security.JwtTokenProvider;
import com.fosso.backend.fosso_backend.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String login(AuthRequest authRequest) {
        authRequest.setEmail(authRequest.getEmail().toLowerCase());
      authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );
        User user = userService.getUserByEmail(authRequest.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isEnabled()) {
            if (user.getBanExpirationTime() != null && user.getBanExpirationTime().isAfter(LocalDateTime.now())) {
                throw new ResourceNotFoundException("User is banned until: " + user.getBanExpirationTime());
            }
            user.setEnabled(true);
            user.setBanExpirationTime(null);
            userService.saveUser(user);
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getUserId());
        claims.put("email", user.getEmail());
        claims.put("name", user.getFirstName() + " " + user.getLastName());
        claims.put("role", user.getRoles());

        return tokenProvider.generateJwtToken(user, claims);
    }

    @Override
    public String register(RegisterRequest registerRequest) {
        if (userService.isEmailUnique(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + registerRequest.getEmail());
        }

        User user = UserMapper.toUser(registerRequest, passwordEncoder.encode(registerRequest.getPassword()));
        user.setUserId(UUID.randomUUID().toString());

        userService.saveUser(user);
        return "User registered successfully";

    }
}
