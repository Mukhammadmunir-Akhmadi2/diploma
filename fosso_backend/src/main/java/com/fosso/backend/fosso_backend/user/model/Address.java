package com.fosso.backend.fosso_backend.user.model;

import lombok.Data;

@Data
public class Address {
    private String addressId;
    private String addressType;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private boolean isDefault;
    private String country;
}