package com.fosso.backend.fosso_backend.user.service.admin;

import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.dto.UserUpdateDTO;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserBriefDTO;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    String hardDeleteUser(String userId);
    String updateUser(String userId, UserUpdateDTO userDetails);
    String updateUserAddress(String userId, AddressDTO addressDTO);
    String blockUser(String userId, int banDuration);
    String unblockUser(String userId);
    Page<AdminUserBriefDTO> findByKeyword(Pageable pageable, String keyword);
    AdminUserDetailDTO getUserById(String userId);
    String updateUserRole(String userId, Role role);
    String restoreUser(String userId);
}
