package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSStatsResponse {

    private long totalAnalyses;
    private double averageScore;
    private int bestScore;
}
