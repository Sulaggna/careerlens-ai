package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewHistoryResponse {
    private Long id;
    private Long resumeId;
    private String jobTitle;
    private Integer questionCount;
    private String status;
    private Integer overallScore;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
