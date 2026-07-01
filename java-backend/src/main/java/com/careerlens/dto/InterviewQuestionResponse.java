package com.careerlens.dto;

import com.careerlens.entity.InterviewQuestion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {
    private Long id;
    private Long sessionId;
    private String questionText;
    private String category;
    private String difficulty;
    private Integer orderIndex;
    private InterviewAnswerResponse answer;

    public static InterviewQuestionResponse fromEntity(InterviewQuestion entity) {
        return new InterviewQuestionResponse(
                entity.getId(),
                entity.getSessionId(),
                entity.getQuestionText(),
                entity.getCategory(),
                entity.getDifficulty(),
                entity.getOrderIndex(),
                null
        );
    }
}
