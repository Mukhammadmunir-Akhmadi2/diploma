package com.fosso.backend.fosso_backend.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {

    private static final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_FORMAT);

    public static String toString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(FORMATTER);
    }

    public static LocalDateTime toLocalDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeString, FORMATTER);
    }
}