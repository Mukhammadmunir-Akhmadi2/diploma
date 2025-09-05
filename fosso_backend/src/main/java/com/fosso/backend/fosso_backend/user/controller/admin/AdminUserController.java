package com.fosso.backend.fosso_backend.user.controller.admin;

import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.dto.UserUpdateDTO;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserBriefDTO;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserDetailDTO;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.user.service.admin.AdminUserService;
import com.fosso.backend.fosso_backend.common.utils.PaginationUtil;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/user")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getAllUsersByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "email,asc") String[] sort
    ) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<AdminUserBriefDTO> pageUsers = adminUserService.findByKeyword(pageable, null);
        List<AdminUserBriefDTO> users = pageUsers.getContent();
        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageUsers, users));
    }
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "email,asc") String[] sort,
            @RequestParam String keyword) {
        Pageable pageable = PaginationUtil.createPageable(page, size, sort);
        Page<AdminUserBriefDTO> pageUsers = adminUserService.findByKeyword(pageable, keyword);
        if (pageUsers.isEmpty() && pageUsers.getTotalElements() == 0) {
            throw new ResourceNotFoundException("No users found");
        }
        List<AdminUserBriefDTO> users = pageUsers.getContent();
        return ResponseEntity.ok(PaginationUtil.buildPageResponse(pageUsers, users));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDetailDTO> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(adminUserService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable String userId,
                                                      @Valid @RequestBody UserUpdateDTO userDetails,
                                                      BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(adminUserService.updateUser(userId, userDetails));
    }

    @PutMapping("/{userId}/address")
    public ResponseEntity<String> updateUserAddress(@PathVariable String userId,
                                                        @Valid @RequestBody AddressDTO addressDTO,
                                                        BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(adminUserService.updateUserAddress(userId, addressDTO));
    }

    @DeleteMapping("/hard-delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(adminUserService.hardDeleteUser(userId));
    }
    @PutMapping("/user/{userId}/restore")
    public ResponseEntity<String> restoreUser(@PathVariable String userId) {
        return ResponseEntity.ok(adminUserService.restoreUser(userId));
    }

    @PutMapping("/{userId}/block")
    public ResponseEntity<String> blockUser(
            @PathVariable String userId,
            @RequestParam int banDuration) {
        return ResponseEntity.ok(adminUserService.blockUser(userId, banDuration));
    }

    @PutMapping("/{userId}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable String userId) {
        return ResponseEntity.ok(adminUserService.unblockUser(userId));
    }
    @PutMapping("/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable String userId,
            @RequestParam Role role) {
        return ResponseEntity.ok(adminUserService.updateUserRole(userId, role));
    }

}
