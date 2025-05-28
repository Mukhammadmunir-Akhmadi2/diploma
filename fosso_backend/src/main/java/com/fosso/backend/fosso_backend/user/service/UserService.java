package com.fosso.backend.fosso_backend.user.service;

import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.dto.PasswordChangeRequest;
import com.fosso.backend.fosso_backend.user.model.Address;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.dto.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    User getUserById(String userId);
    boolean isEmailUnique(String email);
    boolean isEmailUnique(String email, String currentUserId);
    Optional<User> getUserByEmail(String email);
    User getCurrentUser();
    Page<User> getUsersByPage(String keyword, Pageable pageable);
    User updateCurrentUserProfile(UserUpdateDTO profileDTO);
    List<Address> getCurrentUserAddress();
    Address updateCurrentUserAddress(AddressDTO addressDTO);
    Address addAddress(AddressDTO addressDTO);
    String deleteUserAddress(String addressId);
    String softDeleteUser();
    String changePassword(PasswordChangeRequest changeRequest);
}
