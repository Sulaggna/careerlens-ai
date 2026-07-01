package com.careerlens.dto;

import com.careerlens.entity.InterviewSession;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSessionResponse {
    private Long id;
    private Long userId;
    private Long resumeId;
    private String jobTitle;
    private String jobDescription;
    private Integer questionCount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public static InterviewSessionResponse fromEntity(InterviewSession entity) {
        return new InterviewSessionResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getResumeId(),
                entity.getJobTitle(),
                entity.getJobDescription(),
                entity.getQuestionCount(),
                entity.getStatus().name(),
                entity.getCreatedAt(),
                entity.getCompletedAt()
        );
    }
}
