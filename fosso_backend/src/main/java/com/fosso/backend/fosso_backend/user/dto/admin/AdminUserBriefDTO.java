package com.fosso.backend.fosso_backend.user.dto.admin;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
public class AdminUserBriefDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Gender gender;
    private ImageDTO image;
    private Boolean enabled;
    private Set<Role> roles;
    private boolean isDeleted;
    private String createdDate;
    private int orderCount;
    private BigDecimal totalSpent = BigDecimal.ZERO;
}
