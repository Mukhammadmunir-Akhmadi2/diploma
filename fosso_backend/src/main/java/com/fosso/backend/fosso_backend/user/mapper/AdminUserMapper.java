package com.fosso.backend.fosso_backend.user.mapper;

import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserBriefDTO;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserDetailDTO;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.common.utils.DateTimeUtils;
import com.fosso.backend.fosso_backend.common.utils.DateUtils;

import java.math.BigDecimal;

public class AdminUserMapper {

    public static AdminUserDetailDTO toAdminUserDetailDTO(User user, int orderCount, BigDecimal totalPrice) {
        return AdminUserDetailDTO.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .roles(user.getRoles())
                .gender(user.getGender())
                .dateOfBirth(DateUtils.localDateToString(user.getDateOfBirth()))
                .enabled(user.isEnabled())
                .banExpirationTime(user.getBanExpirationTime() != null ?
                        DateTimeUtils.toString(user.getBanExpirationTime())
                        : null)
                .updatedBy(user.getUpdatedBy())
                .createdTime(DateTimeUtils.toString(user.getCreatedTime()))
                .updatedTime(DateTimeUtils.toString(user.getUpdatedTime()))
                .isDeleted(user.isDeleted())
                .addresses(user.getAddresses())
                .orderCount(orderCount)
                .totalSpent(totalPrice)
                .build();
    }

    public static AdminUserBriefDTO toAdminUserBriefDTO(User user, int orderCount, BigDecimal totalPrice) {
        return AdminUserBriefDTO.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .enabled(user.isEnabled())
                .roles(user.getRoles())
                .createdDate(user.getCreatedTime() != null ? DateUtils.localDateToString(user.getCreatedTime().toLocalDate()): null)
                .orderCount(orderCount)
                .totalSpent(totalPrice)
                .isDeleted(user.isDeleted())
                .build();
    }
}