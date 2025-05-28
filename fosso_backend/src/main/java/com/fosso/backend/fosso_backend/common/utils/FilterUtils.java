package com.fosso.backend.fosso_backend.common.utils;

import com.fosso.backend.fosso_backend.common.enums.Gender;

import java.math.BigDecimal;
import java.util.List;

public class FilterUtils {
    public static boolean hasValue(String value) {
        return value != null && !value.trim().isEmpty();
    }
    public static boolean hasValue(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) >= 0;
    }
    public static boolean hasValue(List<String> values) {
        return values != null && !values.isEmpty();
    }
    public static boolean hasValue(Gender gender) {
        return gender != null;
    }
}
