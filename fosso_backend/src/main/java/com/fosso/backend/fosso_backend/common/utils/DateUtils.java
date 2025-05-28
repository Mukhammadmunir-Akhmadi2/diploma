package com.fosso.backend.fosso_backend.common.utils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateUtils {

    private static final String DATE_FORMAT = "yyyy-MM-dd";
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(DATE_FORMAT);

    public static LocalDate stringToLocalDate(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            System.err.println("Error parsing date string: " + dateString + " using format: " + DATE_FORMAT);
            return null;
        }
    }

    public static String localDateToString(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(dateFormatter);
    }
}