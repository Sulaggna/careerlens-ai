package com.careerlens.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartInterviewRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String jobDescription;

    @NotNull(message = "Question count is required")
    @Min(value = 5, message = "Minimum 5 questions required")
    @Max(value = 20, message = "Maximum 20 questions allowed")
    private Integer questionCount;
}
