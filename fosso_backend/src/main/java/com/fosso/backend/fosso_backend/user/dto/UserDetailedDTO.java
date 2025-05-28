package com.fosso.backend.fosso_backend.user.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data
@Builder
public class UserDetailedDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Set<Role> roles;
    private Gender gender;
    private String imageId;
    private String dateOfBirth;
}


