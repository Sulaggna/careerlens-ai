package com.careerlens.service;

import com.careerlens.dto.*;
import com.careerlens.entity.*;
import com.careerlens.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final QuestionGeneratorService questionGeneratorService;
    private final AnswerEvaluationService answerEvaluationService;

    @Transactional
    public InterviewSessionResponse startInterview(String userEmail, StartInterviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUserId(request.getResumeId(), user.getId())
                .orElseThrow(() -> new ForbiddenException("You do not have access to this resume"));

        InterviewSession session = new InterviewSession();
        session.setUserId(user.getId());
        session.setResumeId(resume.getId());
        session.setJobTitle(request.getJobTitle());
        session.setJobDescription(request.getJobDescription());
        session.setQuestionCount(request.getQuestionCount());
        session.setStatus(InterviewSession.Status.STARTED);

        InterviewSession savedSession = sessionRepository.save(session);

        List<InterviewQuestion> questions = questionGeneratorService.generateQuestions(
                request.getJobTitle(),
                request.getQuestionCount()
        );

        for (InterviewQuestion question : questions) {
            question.setSessionId(savedSession.getId());
        }

        List<InterviewQuestion> savedQuestions = questionRepository.saveAll(questions);

        savedSession.setStatus(InterviewSession.Status.IN_PROGRESS);
        sessionRepository.save(savedSession);

        return InterviewSessionResponse.fromEntity(savedSession);
    }

    public InterviewSessionResponse getSession(String userEmail, Long sessionId) {
        InterviewSession session = getOwnedSession(userEmail, sessionId);
        return InterviewSessionResponse.fromEntity(session);
    }

    public List<InterviewQuestionResponse> getQuestions(String userEmail, Long sessionId) {
        InterviewSession session = getOwnedSession(userEmail, sessionId);
        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderByOrderIndexAsc(sessionId);

        return questions.stream()
                .map(q -> {
                    InterviewQuestionResponse response = InterviewQuestionResponse.fromEntity(q);
                    answerRepository.findByQuestionId(q.getId()).ifPresent(answer -> {
                        response.setAnswer(InterviewAnswerResponse.fromEntity(answer));
                    });
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewAnswerResponse submitAnswer(String userEmail, Long sessionId, Long questionId, InterviewAnswerRequest request) {
        InterviewSession session = getOwnedSession(userEmail, sessionId);
        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getSessionId().equals(sessionId)) {
            throw new ForbiddenException("Question does not belong to this session");
        }

        AnswerEvaluationService.EvaluationResult evaluation = answerEvaluationService.evaluateAnswer(
                question.getQuestionText(),
                request.getAnswerText()
        );

        InterviewAnswer answer = new InterviewAnswer();
        answer.setQuestionId(questionId);
        answer.setAnswerText(request.getAnswerText());
        answer.setFeedback(evaluation.feedback());
        answer.setScore(evaluation.score());
        answer.setAnsweredAt(LocalDateTime.now());

        InterviewAnswer savedAnswer = answerRepository.save(answer);
        return InterviewAnswerResponse.fromEntity(savedAnswer);
    }

    @Transactional
    public InterviewFeedbackResponse completeSession(String userEmail, Long sessionId) {
        InterviewSession session = getOwnedSession(userEmail, sessionId);

        if (session.getStatus() == InterviewSession.Status.COMPLETED) {
            return feedbackRepository.findBySessionId(sessionId)
                    .map(InterviewFeedbackResponse::fromEntity)
                    .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        }

        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderByOrderIndexAsc(sessionId);
        List<Integer> scores = new java.util.ArrayList<>();
        List<String> categories = new java.util.ArrayList<>();

        for (InterviewQuestion question : questions) {
            answerRepository.findByQuestionId(question.getId()).ifPresent(answer -> {
                if (answer.getScore() != null) {
                    scores.add(answer.getScore());
                }
                if (question.getCategory() != null) {
                    categories.add(question.getCategory());
                }
            });
        }

        AnswerEvaluationService.FeedbackSummary summary = answerEvaluationService.generateSessionFeedback(scores, categories);

        InterviewFeedback feedback = new InterviewFeedback();
        feedback.setSessionId(sessionId);
        feedback.setOverallScore(summary.overallScore());
        feedback.setStrengths(summary.strengths());
        feedback.setImprovements(summary.improvements());
        feedback.setRecommendations(summary.recommendations());

        InterviewFeedback savedFeedback = feedbackRepository.save(feedback);

        session.setStatus(InterviewSession.Status.COMPLETED);
        sessionRepository.save(session);

        return InterviewFeedbackResponse.fromEntity(savedFeedback);
    }

    public List<InterviewHistoryResponse> getHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<InterviewSession> sessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return sessions.stream()
                .map(session -> {
                    InterviewFeedbackResponse feedback = feedbackRepository.findBySessionId(session.getId())
                            .map(InterviewFeedbackResponse::fromEntity)
                            .orElse(null);

                    return new InterviewHistoryResponse(
                            session.getId(),
                            session.getResumeId(),
                            session.getJobTitle(),
                            session.getQuestionCount(),
                            session.getStatus().name(),
                            feedback != null ? feedback.getOverallScore() : null,
                            session.getCreatedAt(),
                            session.getCompletedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    private InterviewSession getOwnedSession(String userEmail, Long sessionId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return sessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ForbiddenException("You do not have access to this interview session"));
    }
}
