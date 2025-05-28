package com.fosso.backend.fosso_backend.user.mapper;

import com.fosso.backend.fosso_backend.common.enums.Role;

import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.dto.*;
import com.fosso.backend.fosso_backend.common.utils.DateUtils;

public class UserMapper {

    public static User toUser(RegisterRequest registerRequest, String encodedPassword) {
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail().toLowerCase());
        user.setPassword(encodedPassword);
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(Role.USER);
        return user;
    }

    public static UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .imageId(user.getImageId())
                .build();
    }

    public static UserBriefDTO toUserBriefDTO(User user) {
        return UserBriefDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .imageId(user.getImageId())
                .build();
    }
    public static UserDetailedDTO toUserDetailedDTO(User user) {
        return UserDetailedDTO.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.isPhoneNumberPrivate() ? null : user.getPhoneNumber())
                .roles(user.getRoles())
                .gender(user.isGenderPrivate() ? null : user.getGender())
                .imageId(user.getImageId())
                .dateOfBirth(user.isDateOfBirthPrivate() ? null : DateUtils.localDateToString(user.getDateOfBirth()))
                .build();
    }

    public static UserProfileDTO toUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .isPhoneNumberPrivate(user.isPhoneNumberPrivate())
                .dateOfBirth(DateUtils.localDateToString(user.getDateOfBirth()))
                .isDateOfBirthPrivate(user.isDateOfBirthPrivate())
                .gender(user.getGender())
                .isGenderPrivate(user.isGenderPrivate())
                .imageId(user.getImageId())
                .roles(user.getRoles())
                .build();
    }

    public static void updateUserFromUserUpdateDTO(User user, UserUpdateDTO userDetails) {
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());

        user.setPhoneNumber(userDetails.getPhoneNumber());
        if (Boolean.TRUE.equals(userDetails.getIsPhoneNumberPrivate())) {
            user.setPhoneNumberPrivate(true);
        } else {
            user.setPhoneNumberPrivate(false); // or leave unchanged
        }
        user.setDateOfBirth(DateUtils.stringToLocalDate(userDetails.getDateOfBirth()));

        if (Boolean.TRUE.equals(userDetails.getIsDateOfBirthPrivate())) {
            user.setDateOfBirthPrivate(true);
        } else {
            user.setDateOfBirthPrivate(false); // or leave unchanged
        }

        if (Boolean.TRUE.equals(userDetails.getIsGenderPrivate())) {
            user.setGenderPrivate(true);
        } else {
            user.setGenderPrivate(false); // or leave unchanged
        }

        user.setGender(userDetails.getGender());
    }
}