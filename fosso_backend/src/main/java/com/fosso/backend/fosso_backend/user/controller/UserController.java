package com.fosso.backend.fosso_backend.user.controller;

import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.user.mapper.AddressMapper;
import com.fosso.backend.fosso_backend.image.mapper.ImageMapper;
import com.fosso.backend.fosso_backend.user.mapper.UserMapper;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.image.service.impl.ImageServiceImpl;
import com.fosso.backend.fosso_backend.user.service.impl.UserServiceImpl;
import com.fosso.backend.fosso_backend.user.dto.*;
import com.fosso.backend.fosso_backend.common.utils.ValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final AuthenticatedUserProvider userProvider;
    private final ImageServiceImpl imageService;

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserDetailedDTO> getUserProfileById(@PathVariable String userId) {
        return ResponseEntity.ok(UserMapper.toUserDetailedDTO(userService.getUserById(userId)));
    }
    @GetMapping("/{userId}")
    public ResponseEntity<UserBriefDTO> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(UserMapper.toUserBriefDTO(userService.getUserById(userId)));
    }
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(UserMapper.toUserDTO(userService.getCurrentUser()));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile() {
        return ResponseEntity.ok(UserMapper.toUserProfileDTO(userService.getCurrentUser()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateCurrentUser(@Valid @RequestBody UserUpdateDTO userDetails,
                                                                  BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(UserMapper.toUserProfileDTO(userService.updateCurrentUserProfile(userDetails)));
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteUser() {
        userService.softDeleteUser();
        return ResponseEntity.ok().body(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/me/address")
    public ResponseEntity<List<AddressDTO>> getCurrentUserAddress() {
        List<AddressDTO> addressDTOList = userService.getCurrentUserAddress().stream()
                .map(AddressMapper::toDTO)
                .toList();
        return ResponseEntity.ok(addressDTOList);
    }

    @PostMapping("/me/address")
    public ResponseEntity<AddressDTO> addCurrentUserAddress(@Valid @RequestBody AddressDTO addressDTO,
                                                           BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(AddressMapper.toDTO(userService.addAddress(addressDTO)));
    }

    @PutMapping("/me/address")
    public ResponseEntity<AddressDTO> updateCurrentUserAddress(@Valid @RequestBody AddressDTO addressDTO,
                                                               BindingResult bindingResult) {
        ValidationUtils.validate(bindingResult);
        return ResponseEntity.ok(AddressMapper.toDTO(userService.updateCurrentUserAddress(addressDTO)));
    }

    @DeleteMapping("/me/address/{addressId}")
    public ResponseEntity<String> deleteUserAddress(@PathVariable String addressId) {
        return ResponseEntity.ok(userService.deleteUserAddress(addressId));
    }

    @GetMapping("/me/avatar")
    public ResponseEntity<ImageDTO> getAvatar() {
        User currentUser = userProvider.getAuthenticatedUser();
        Image image = imageService.getImageById(currentUser.getImageId(), ImageType.USER_AVATAR);
        return ResponseEntity.ok().body(ImageMapper.convertToDTO(image));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<ImageDTO> uploadImage(@RequestParam("file") MultipartFile file) {
        User currentUser = userProvider.getAuthenticatedUser();
        if (currentUser.getImageId() != null) {
            imageService.deleteImage(currentUser.getUserId(), currentUser.getImageId(), ImageType.USER_AVATAR);
        }
        Image image = imageService.uploadImage(file, currentUser.getUserId(), ImageType.USER_AVATAR);

        return ResponseEntity.ok().body(ImageMapper.convertToDTO(image));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));

    }
}