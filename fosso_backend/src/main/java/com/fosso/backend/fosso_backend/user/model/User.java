package com.fosso.backend.fosso_backend.user.model;

import com.fosso.backend.fosso_backend.common.enums.Gender;
import com.fosso.backend.fosso_backend.common.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
@Document(collection = "users")
public class User implements UserDetails {
    @Id
    private String userId;
    @Indexed(unique = true)
    @TextIndexed
    private String email;
    @TextIndexed
    private String firstName;
    @TextIndexed
    private String lastName;
    private String phoneNumber;
    private boolean isPhoneNumberPrivate = true;
    private String password;
    private LocalDate dateOfBirth;
    private boolean isDateOfBirthPrivate = true;
    private Gender gender;
    private boolean isGenderPrivate = true;
    private String imageId;
    private boolean enabled = true;
    private Set<Role> roles = new HashSet<>();
    private List<Address> addresses = new ArrayList<>();
    private List<PaymentCard> paymentCards = new ArrayList<>();
    private Set<String> productsId = new HashSet<>();
    private String updatedBy;
    private LocalDateTime banExpirationTime;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private boolean isDeleted = false;

    public void setRole(Role role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
    }
    public void setPaymentCard(PaymentCard paymentCard) {
        if (this.paymentCards == null) {
            this.paymentCards = new ArrayList<>();
        }
        this.paymentCards.add(paymentCard);
    }
    public void setAdress(Address address) {
        if (this.addresses == null) {
            this.addresses = new ArrayList<>();
        }
        this.addresses.add(address);
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();

    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
