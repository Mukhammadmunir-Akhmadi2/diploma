package com.fosso.backend.fosso_backend.common.enums;

public enum Role {
    USER("ROLE_USER"),
    MERCHANT("ROLE_MERCHANT"),
    ADMIN("ROLE_ADMIN");

    private String name;

    Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
