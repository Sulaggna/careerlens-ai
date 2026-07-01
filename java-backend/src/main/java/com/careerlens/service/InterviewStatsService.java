package com.careerlens.service;

import com.careerlens.dto.InterviewStatsResponse;
import com.careerlens.entity.InterviewFeedback;
import com.careerlens.entity.InterviewSession;
import com.careerlens.repository.InterviewFeedbackRepository;
import com.careerlens.repository.InterviewSessionRepository;
import com.careerlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewStatsService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public InterviewStatsResponse getStats(String userEmail) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<InterviewSession> completedSessions = sessions.stream()
                .filter(s -> s.getStatus() == InterviewSession.Status.COMPLETED)
                .toList();

        long totalInterviews = sessions.size();
        long completedInterviews = completedSessions.size();

        if (completedInterviews == 0) {
            return InterviewStatsResponse.builder()
                    .totalInterviews(totalInterviews)
                    .averageScore(0.0)
                    .bestScore(0)
                    .completedInterviews(completedInterviews)
                    .build();
        }

        List<Integer> scores = completedSessions.stream()
                .map(session -> feedbackRepository.findBySessionId(session.getId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(InterviewFeedback::getOverallScore)
                .filter(score -> score != null)
                .toList();

        double averageScore = scores.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        int bestScore = scores.stream()
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0);

        return InterviewStatsResponse.builder()
                .totalInterviews(totalInterviews)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .bestScore(bestScore)
                .completedInterviews(completedInterviews)
                .build();
    }
}
