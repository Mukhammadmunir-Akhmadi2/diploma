package com.fosso.backend.fosso_backend.user.controller;

import com.fosso.backend.fosso_backend.user.dto.AuthRequest;
import com.fosso.backend.fosso_backend.user.dto.AuthResponse;
import com.fosso.backend.fosso_backend.user.dto.RegisterRequest;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.user.service.AuthService;
import com.fosso.backend.fosso_backend.user.service.UserService;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(new AuthResponse(authService.login(loginRequest)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return new ResponseEntity<>(authService.register(registerRequest), HttpStatus.CREATED);
    }
    @GetMapping("/check-email")
    @ResponseBody
    public ResponseEntity<String> checkEmailUnique(@RequestParam("email") String email,
                                                   @RequestParam(value = "userId", required = false) String userId) {
        if(!userService.isEmailUnique(email, userId)) {
            throw new DuplicateResourceException("Email already exists: " + email);
        }
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}