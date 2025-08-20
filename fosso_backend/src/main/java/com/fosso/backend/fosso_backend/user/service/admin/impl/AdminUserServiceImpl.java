package com.fosso.backend.fosso_backend.user.service.admin.impl;

import com.fosso.backend.fosso_backend.action.service.ActionLogService;
import com.fosso.backend.fosso_backend.common.enums.ImageType;
import com.fosso.backend.fosso_backend.image.dto.ImageDTO;
import com.fosso.backend.fosso_backend.image.model.Image;
import com.fosso.backend.fosso_backend.image.repository.ImageRepository;
import com.fosso.backend.fosso_backend.image.service.ImageService;
import com.fosso.backend.fosso_backend.order.model.Order;
import com.fosso.backend.fosso_backend.order.repository.OrderRepository;
import com.fosso.backend.fosso_backend.order.service.OrderService;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final ActionLogService actionLogService;
    private final ImageRepository imageRepository;
    private final OrderRepository orderRepository;

    @Override
    public String hardDeleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "DELETE",
                "User",
                userId,
                "Hard deleted the user"
        );
        return "User deleted successfully";
    }

    @Override
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

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "User",
                userId,
                "Updated user details"
        );

        return "User updated successfully";
    }

    @Override
    public String updateUserAddress(String userId, AddressDTO addressDTO) {
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

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "Address",
                addressDTO.getAddressId(),
                "Updated user address"
        );
        return "User address updated successfully";
    }

    @Override
    public String blockUser(String userId, int banDuration) {
        User user = userService.getUserById(userId);
        user.setEnabled(false);
        user.setBanExpirationTime(LocalDateTime.now().plusDays(banDuration));
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());
        userRepository.save(user);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "User",
                userId,
                "Blocked the user"
        );
        return "User blocked successfully";
    }

    @Override
    public String unblockUser(String userId) {
        User user = userService.getUserById(userId);
        user.setEnabled(true);
        user.setBanExpirationTime(null);
        user.setUpdatedTime(LocalDateTime.now());
        user.setUpdatedBy(userProvider.getAuthenticatedUser().getEmail());
        userRepository.save(user);

        actionLogService.logAction(
                userProvider.getAuthenticatedUser().getUserId(),
                "UPDATE",
                "User",
                userId,
                "Unblocked the user"
        );
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
            Image image = fetchUserImage(user);
            List<Order> orders = fetchUserOrders(user);
            BigDecimal totalSpend = calculateTotalSpend(orders);

            return AdminUserMapper.toAdminUserBriefDTO(user, image, orders.size(), totalSpend);
        });
    }

    @Override
    public AdminUserDetailDTO getUserById(String userId) {
        User user =  userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Image image = fetchUserImage(user);
        List<Order> orders = fetchUserOrders(user);
        BigDecimal totalSpend = calculateTotalSpend(orders);
        return AdminUserMapper.toAdminUserDetailDTO(user, image, orders.size(),totalSpend);
    }

    @Override
    public String updateUserRole(String userId, Role role) {
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

        actionLogService.logAction(
                currentAdmin.getUserId(),
                "UPDATE",
                "User",
                userId,
                "Updated user role to " + role
        );
        return "User role updated successfully";
    }

   @Override
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

       actionLogService.logAction(
               userProvider.getAuthenticatedUser().getUserId(),
               "RESTORE",
               "User",
               userId,
               "Restored the user"
       );

       return "User restored successfully";
   }

    private Image fetchUserImage(User user) {
        return imageRepository.findByImageIdAndType(user.getImageId(), ImageType.USER_AVATAR).orElse(null);
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
                .map(Order::getTotal) // Assuming `getTotal` returns BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
