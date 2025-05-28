package com.fosso.backend.fosso_backend.user.dto;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserProfileDTO {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isPhoneNumberPrivate;
    private String dateOfBirth;
    private Boolean isDateOfBirthPrivate;
    private Gender gender;
    private Boolean isGenderPrivate;
    private String imageId;
    private Set<Role> roles;
}
