package com.careerlens.service;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class AnswerEvaluationService {

    private final Random random = new Random();

    public EvaluationResult evaluateAnswer(String questionText, String answerText) {
        int score = calculateScore(answerText);
        String feedback = generateFeedback(questionText, answerText, score);
        return new EvaluationResult(score, feedback);
    }

    private int calculateScore(String answer) {
        if (answer == null || answer.isBlank()) {
            return 0;
        }

        int wordCount = answer.split("\\s+").length;
        int baseScore = Math.min(60, wordCount * 3);

        List<String> actionVerbs = List.of(
                "implemented", "developed", "designed", "created", "built",
                "led", "managed", "achieved", "improved", "optimized",
                "solved", "delivered", "launched", "deployed", "architected"
        );

        int verbBonus = 0;
        String lowerAnswer = answer.toLowerCase();
        for (String verb : actionVerbs) {
            if (lowerAnswer.contains(verb)) {
                verbBonus += 5;
            }
        }

        List<String> qualityIndicators = List.of(
                "result", "impact", "outcome", "metric", "percentage",
                "increased", "decreased", "reduced", "improved", "saved"
        );

        int qualityBonus = 0;
        for (String indicator : qualityIndicators) {
            if (lowerAnswer.contains(indicator)) {
                qualityBonus += 3;
            }
        }

        int totalScore = baseScore + verbBonus + qualityBonus;
        return Math.min(100, totalScore);
    }

    private String generateFeedback(String question, String answer, int score) {
        List<String> feedback = new ArrayList<>();

        if (score >= 80) {
            feedback.add("Excellent answer! You provided a comprehensive response with specific examples.");
            feedback.add("Your use of action verbs and quantifiable results is impressive.");
        } else if (score >= 60) {
            feedback.add("Good answer. You covered the main points well.");
            feedback.add("Consider adding more specific examples or metrics to strengthen your response.");
        } else if (score >= 40) {
            feedback.add("Your answer addresses the question but could be more detailed.");
            feedback.add("Try to use the STAR method (Situation, Task, Action, Result) for better structure.");
            feedback.add("Include specific examples from your experience to make your answer more compelling.");
        } else {
            feedback.add("Your answer needs more detail and structure.");
            feedback.add("Use the STAR method to organize your response: Situation, Task, Action, Result.");
            feedback.add("Provide concrete examples and quantify your achievements when possible.");
            feedback.add("Focus on your specific contributions and the impact of your work.");
        }

        if (answer != null && answer.split("\\s+").length < 30) {
            feedback.add("Consider expanding your answer with more details and examples.");
        }

        return String.join(" ", feedback);
    }

    public FeedbackSummary generateSessionFeedback(List<Integer> scores, List<String> categories) {
        double averageScore = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
        int bestScore = scores.stream().mapToInt(Integer::intValue).max().orElse(0);

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (averageScore >= 70) {
            strengths.add("Strong overall performance across all questions");
            strengths.add("Good use of specific examples and metrics");
        } else if (averageScore >= 50) {
            strengths.add("Solid foundation with room for improvement");
            improvements.add("Work on providing more detailed responses");
        } else {
            improvements.add("Focus on structuring answers using the STAR method");
            improvements.add("Practice with more behavioral questions");
        }

        if (categories.contains("Technical") && averageScore < 60) {
            improvements.add("Review technical concepts and practice explaining them clearly");
            recommendations.add("Consider taking online courses to strengthen technical knowledge");
        }

        if (categories.contains("System Design") && averageScore < 60) {
            improvements.add("Study system design patterns and scalability principles");
            recommendations.add("Practice designing systems for different use cases");
        }

        if (categories.contains("Behavioral") && averageScore < 60) {
            improvements.add("Prepare more stories using the STAR method");
            recommendations.add("Reflect on past experiences and document key achievements");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("Continue practicing with diverse interview questions");
            recommendations.add("Record your answers and review them for improvement");
        }

        return new FeedbackSummary(
                (int) Math.round(averageScore),
                String.join(". ", strengths) + (strengths.isEmpty() ? "" : "."),
                String.join(". ", improvements) + (improvements.isEmpty() ? "" : "."),
                String.join(". ", recommendations) + (recommendations.isEmpty() ? "" : ".")
        );
    }

    public record EvaluationResult(int score, String feedback) {}
    public record FeedbackSummary(int overallScore, String strengths, String improvements, String recommendations) {}
}
