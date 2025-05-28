package com.fosso.backend.fosso_backend.user.dto.admin;

import com.fosso.backend.fosso_backend.action.model.ActionLog;
import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.review.model.Review;
import com.fosso.backend.fosso_backend.user.model.Address;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class AdminUserDetailDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Set<Role> roles;
    private Gender gender;
    private ImageDTO image;
    private String dateOfBirth;
    private Boolean enabled;
    private String banExpirationTime;
    private String updatedBy;
    private String createdTime;
    private String updatedTime;
    private Boolean isDeleted;
    private List<Address> addresses;
    private int orderCount;
    private BigDecimal totalSpent = BigDecimal.ZERO;
}
