package com.fosso.backend.fosso_backend.user.dto;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class UserBriefDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String imageId;
}
