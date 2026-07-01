package com.careerlens.dto;

import com.careerlens.entity.InterviewFeedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewFeedbackResponse {
    private Long id;
    private Long sessionId;
    private Integer overallScore;
    private String strengths;
    private String improvements;
    private String recommendations;

    public static InterviewFeedbackResponse fromEntity(InterviewFeedback entity) {
        return new InterviewFeedbackResponse(
                entity.getId(),
                entity.getSessionId(),
                entity.getOverallScore(),
                entity.getStrengths(),
                entity.getImprovements(),
                entity.getRecommendations()
        );
    }
}
