package com.fosso.backend.fosso_backend.common.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PaginationUtil {

    public static Pageable createPageable(int page, int size, String[] sort) {
        String sortField = sort[0];
        String sortDirection = sort.length > 1 ? sort[1] : "asc";
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

        return PageRequest.of(page - 1, size, Sort.by(direction, sortField));
    }

    public static <T> Map<String, Object> buildPageResponse(Page<T> page, List<?> content) {
        Map<String, Object> response = new HashMap<>();
        response.put("products", content);
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        return response;
    }
}
