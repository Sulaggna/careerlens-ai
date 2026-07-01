package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    private boolean success;
    private String message;
    private int status;
    private Map<String, String> errors;
    private LocalDateTime timestamp;

    public static ErrorResponse of(int status, String message) {
        return ErrorResponse.builder()
                .success(false)
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ErrorResponse of(int status, String message, Map<String, String> errors) {
        return ErrorResponse.builder()
                .success(false)
                .status(status)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
