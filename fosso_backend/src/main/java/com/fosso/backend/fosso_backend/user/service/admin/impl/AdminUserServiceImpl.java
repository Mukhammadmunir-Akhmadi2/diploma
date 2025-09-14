package com.fosso.backend.fosso_backend.user.service.admin.impl;

import com.fosso.backend.fosso_backend.common.aop.Loggable;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.repository.OrderRepository;
import com.fosso.backend.fosso_backend.user.dto.AddressDTO;
import com.fosso.backend.fosso_backend.user.dto.UserUpdateDTO;
import com.fosso.backend.fosso_backend.common.enums.Role;
import com.fosso.backend.fosso_backend.common.exception.DuplicateResourceException;
import com.fosso.backend.fosso_backend.common.exception.ResourceNotFoundException;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserBriefDTO;
import com.fosso.backend.fosso_backend.user.dto.admin.AdminUserDetailDTO;
import com.fosso.backend.fosso_backend.user.mapper.AddressMapper;
import com.fosso.backend.fosso_backend.user.mapper.AdminUserMapper;
import com.fosso.backend.fosso_backend.user.mapper.UserMapper;
import com.fosso.backend.fosso_backend.user.model.Address;
import com.fosso.backend.fosso_backend.user.model.User;
import com.fosso.backend.fosso_backend.user.repository.UserRepository;
import com.fosso.backend.fosso_backend.security.AuthenticatedUserProvider;
import com.fosso.backend.fosso_backend.user.service.UserService;
import com.fosso.backend.fosso_backend.user.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AuthenticatedUserProvider userProvider;
    private final OrderRepository orderRepository;

    @Override
    @Loggable(action = "DELETE", entity = "User", message = "Hard deleted the user")
    public String hardDeleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
        return "User deleted successfully";
    }

    @Override
    @Loggable(action = "UPDATE", entity = "User", message = "Updated user details")
    public String updateUser(String userId, UserUpdateDTO userDetails) {
        User user = userService.getUserById(userId);

        if (userDetails.getEmail() != null &&
                !user.getEmail().equals(userDetails.getEmail()) &&
                !userService.isEmailUnique(userDetails.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + userDetails.getEmail());
        }

        UserMapper.updateUserFromUserUpdateDTO(user, userDetails);

        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());

        userRepository.save(user);

        return "User updated successfully";
    }

    @Override
    @Loggable(action = "UPDATE", entity = "Address", message = "Updated user address")
    public String updateUserAddress(String userId, AddressDTO addressDTO) { // needs change
        User user = userService.getUserById(userId);

        for (Address existingAddress : user.getAddresses()) {
            if (existingAddress.getAddressId().equals(addressDTO.getAddressId())) {
                AddressMapper.updateAddressFromAddressDTO(existingAddress, addressDTO);
                break;
            }
        }
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());

        userRepository.save(user);

        return "User address updated successfully";
    }

    @Override
    @Loggable(action = "UPDATE", entity = "User", message = "Blocked the user")
    public String blockUser(String userId, int banDuration) {
        User user = userService.getUserById(userId);
        user.setEnabled(false);
        user.setBanExpirationTime(LocalDateTime.now().plusDays(banDuration));
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());

        userRepository.save(user);

        return "User blocked successfully";
    }

    @Override
    @Loggable(action = "UPDATE", entity = "User", message = "Unblocked the user")
    public String unblockUser(String userId) {
        User user = userService.getUserById(userId);
        user.setEnabled(true);
        user.setBanExpirationTime(null);
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());

        userRepository.save(user);

        return "User unblocked successfully";
    }

    @Override
    public Page<AdminUserBriefDTO> findByKeyword(Pageable pageable, String keyword) {
        Page<User> users;
        if (keyword != null && !keyword.isEmpty()) {
            users = userRepository.findByKeyword(keyword, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(user -> {
            List<Order> orders = fetchUserOrders(user);
            BigDecimal totalSpend = calculateTotalSpend(orders);

            return AdminUserMapper.toAdminUserBriefDTO(user, orders.size(), totalSpend);
        });
    }

    @Override
    public AdminUserDetailDTO getUserById(String userId) {
        User user =  userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Order> orders = fetchUserOrders(user);
        BigDecimal totalSpend = calculateTotalSpend(orders);
        return AdminUserMapper.toAdminUserDetailDTO(user, orders.size(), totalSpend);
    }

    @Override
    @Loggable(action = "UPDATE", entity = "User", message = "Updated user role")
    public String updateUserRole(String userId, Role role) { // needs change
        User user = userService.getUserById(userId);

        User currentAdmin = userProvider.getAuthenticatedUser();
        if (user.getUserId().equals(currentAdmin.getUserId())) {
            throw new IllegalStateException("Cannot change your own role");
        }

        user.getRoles().clear();
        switch (role) {
            case ADMIN:
                user.getRoles().add(Role.USER);
                user.getRoles().add(Role.MERCHANT);
                user.getRoles().add(Role.ADMIN);
                break;
            case MERCHANT:
                user.getRoles().add(Role.USER);
                user.getRoles().add(Role.MERCHANT);
                break;
            case USER:
                user.getRoles().add(Role.USER);
                break;
            default:
                throw new IllegalArgumentException("Invalid role provided");
        }
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(currentAdmin.getEmail());

        userRepository.save(user);

        return "User role updated successfully";
    }

   @Override
   @Loggable(action = "RESTORE", entity = "User", message = "Restored the user")
   public String restoreUser(String userId) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

       if (!user.isDeleted()) {
           throw new IllegalStateException("User is not deleted and cannot be restored");
       }

       user.setDeleted(false);
       user.setEnabled(true);
       user.setUpdatedTime(LocalDateTime.now());
       user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());

       userRepository.save(user);

       return "User restored successfully";
   }

    private List<Order> fetchUserOrders(User user) {
        List<Order> orders =orderRepository.findByCustomerId(user.getUserId());
        if (orders.isEmpty()) {
            return Collections.emptyList();
        }
        return orders;
    }

    private BigDecimal calculateTotalSpend(List<Order> orders) {
        return orders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
