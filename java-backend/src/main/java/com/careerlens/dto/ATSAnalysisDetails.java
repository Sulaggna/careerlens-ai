package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSAnalysisDetails {

    private List<String> missingKeywords;
    private List<String> missingSkills;
    private List<String> missingSections;
    private List<String> weakKeywords;
    private List<String> recommendations;
}
