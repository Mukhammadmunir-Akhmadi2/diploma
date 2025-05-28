package com.fosso.backend.fosso_backend.user.dto;

import com.fosso.backend.fosso_backend.common.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String imageId;
    private Set<Role> roles;
}
