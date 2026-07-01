package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStatsResponse {
    private Long totalInterviews;
    private Double averageScore;
    private Integer bestScore;
    private Long completedInterviews;
}
