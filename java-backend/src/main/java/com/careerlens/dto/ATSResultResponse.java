package com.careerlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSResultResponse {

    private Long id;
    private Long resumeId;
    private Long userId;
    private String resumeTitle;
    private String originalFileName;
    private Integer atsScore;
    private Integer keywordsScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer educationScore;
    private Integer contactScore;
    private Integer formattingScore;
    private List<String> missingKeywords;
    private List<String> missingSkills;
    private List<String> missingSections;
    private List<String> weakKeywords;
    private List<String> recommendations;
    private LocalDateTime analysisDate;
}
