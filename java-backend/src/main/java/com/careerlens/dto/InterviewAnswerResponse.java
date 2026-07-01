package com.careerlens.dto;

import com.careerlens.entity.InterviewAnswer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewAnswerResponse {
    private Long id;
    private Long questionId;
    private String answerText;
    private String audioFilePath;
    private String feedback;
    private Integer score;
    private LocalDateTime answeredAt;

    public static InterviewAnswerResponse fromEntity(InterviewAnswer entity) {
        return new InterviewAnswerResponse(
                entity.getId(),
                entity.getQuestionId(),
                entity.getAnswerText(),
                entity.getAudioFilePath(),
                entity.getFeedback(),
                entity.getScore(),
                entity.getAnsweredAt()
        );
    }
}
