package com.fosso.backend.fosso_backend.user.service.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.common.exception.UnauthorizedException;
import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.dto.PasswordChangeRequest;
import com.fosso.backend.fosso_backend.user.mapper.AddressMapper;
import com.fosso.backend.fosso_backend.user.mapper.UserMapper;
import com.fosso.backend.fosso_backend.user.model.Address;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.service.UserService;
import com.fosso.backend.fosso_backend.user.dto.UserUpdateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserProvider userProvider;
    private final ActionLogService actionLogService;

    @Override
    public boolean isEmailUnique(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean isEmailUnique(String email, String currentUserId) {
        User existingUser = userRepository.findByEmail(email).orElse(null);
        return existingUser == null || existingUser.getUserId().equals(currentUserId);
    }

    @Override
    public User getUserById(String userId) {
        return  userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailAndNotDeleted(email);
    }

    @Override
    public User getCurrentUser() {
        return userProvider.getAuthenticatedUser();
    }

    @Override
    public Page<User> getUsersByPage(String keyword, Pageable pageable) {
        Page<User> userPage;
        if (keyword != null && !keyword.isEmpty()) {
            userPage = userRepository.findByKeywordAndIsDeletedFalse(keyword, pageable);
        } else {
            userPage = userRepository.findByIsDeletedFalse(pageable);
        }
        return userPage;
    }

    @Override
    public User updateCurrentUserProfile(UserUpdateDTO profileDTO) {
        User user = userProvider.getAuthenticatedUser();

        if (!profileDTO.getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }

        if (!isEmailUnique(profileDTO.getEmail(), user.getUserId())) {
            throw new DuplicateResourceException("Email already exists: " + profileDTO.getEmail());
        }

        UserMapper.updateUserFromUserUpdateDTO(user, profileDTO);

        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(user.getEmail());

        User updatedUser = userRepository.save(user);

        actionLogService.logAction(
                user.getUserId(),
                "UPDATE",
                "User",
                user.getUserId(),
                "Updated user profile"
        );
        return updatedUser;
    }

    @Override
    public List<Address> getCurrentUserAddress() {
        User user = userProvider.getAuthenticatedUser();
        if (user.getAddresses() == null || user.getAddresses().isEmpty()) {
            throw new ResourceNotFoundException("Address not found for current user");
        }
        return user.getAddresses();
    }

    @Override
    public Address updateCurrentUserAddress(AddressDTO addressDTO) {
        User user = userProvider.getAuthenticatedUser();
        if (user.getAddresses() == null || user.getAddresses().isEmpty()) {
            throw new ResourceNotFoundException("Address not found for current user");
        }

        for (Address address : user.getAddresses()) {
            if (address.getAddressId().equals(addressDTO.getAddressId())) {
                boolean isDefaultChanged = addressDTO.getIsDefault() != address.isDefault();

                AddressMapper.updateAddressFromAddressDTO(address, addressDTO);

                if (isDefaultChanged && addressDTO.getIsDefault()) {
                    for (Address other : user.getAddresses()) {
                        if (!other.getAddressId().equals(address.getAddressId())) {
                            other.setDefault(false);
                        }
                    }
                }

                address.setDefault(addressDTO.getIsDefault());
                break;
            }
        }
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(user.getEmail());

        User updated = userRepository.save(user);

        actionLogService.logAction(
                user.getUserId(),
                "UPDATE",
                "Address",
                addressDTO.getAddressId(),
                "Updated user address"
        );
        return updated.getAddresses().stream().filter(address -> address.getAddressId().equals(addressDTO.getAddressId())).findFirst().get();
    }

    @Override
    public Address addAddress(AddressDTO addressDTO) {
        User user = userProvider.getAuthenticatedUser();
        addressDTO.setAddressId(UUID.randomUUID().toString());
        user.setAdress(AddressMapper.toEntity(addressDTO));
        if (addressDTO.getIsDefault()) {
            for (Address address : user.getAddresses()) {
                if (!address.getAddressId().equals(addressDTO.getAddressId())) {
                    address.setDefault(false);
                }
            }
        }
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(user.getEmail());

        User updated = userRepository.save(user);

        actionLogService.logAction(
                user.getUserId(),
                "CREATE",
                "Address",
                addressDTO.getAddressId(),
                "Added a new address"
        );

        return updated.getAddresses().stream().filter(address -> address.getAddressId().equals(addressDTO.getAddressId())).findFirst().get();
    }

    @Override
    public String deleteUserAddress(String addressId) {
        User currentUser = userProvider.getAuthenticatedUser();

        if (currentUser.getAddresses() == null || currentUser.getAddresses().isEmpty()) {
            throw new ResourceNotFoundException("No addresses found for the current user");
        }

        List<Address> updatedAddresses = currentUser.getAddresses().stream()
                .filter(address -> !address.getAddressId().equals(addressId))
                .toList();

        if (updatedAddresses.size() == currentUser.getAddresses().size()) {
            throw new ResourceNotFoundException("Address with ID " + addressId + " not found");
        }

        currentUser.setAddresses(updatedAddresses);
        userRepository.save(currentUser);

        actionLogService.logAction(
                currentUser.getUserId(),
                "DELETE",
                "Address",
                addressId,
                "Deleted user address with ID: " + addressId
        );

        return "Address deleted successfully";
    }

    @Override
    public String softDeleteUser() {
        User user = userProvider.getAuthenticatedUser();
        user.setDeleted(true);
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(user.getEmail());
        userRepository.save(user);

        actionLogService.logAction(
                user.getUserId(),
                "DELETE",
                "User",
                user.getUserId(),
                "Soft deleted the user"
        );
        return "User deleted successfully";
    }

    @Override
    public String changePassword(PasswordChangeRequest changeRequest) {
        User currentUser = userProvider.getAuthenticatedUser();

        if (!passwordEncoder.matches(changeRequest.getCurrentPassword(), currentUser.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        currentUser.setPassword(passwordEncoder.encode(changeRequest.getNewPassword()));
        currentUser.setUpdatedTime(LocalDateTime.now());
        currentUser.setUpdatedBy(currentUser.getEmail());
        userRepository.save(currentUser);

        actionLogService.logAction(
                currentUser.getUserId(),
                "UPDATE",
                "User",
                currentUser.getUserId(),
                "Changed password"
        );

        return "Password changed successfully";
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

}