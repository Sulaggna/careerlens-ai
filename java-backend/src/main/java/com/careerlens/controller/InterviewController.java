package com.careerlens.controller;

import com.careerlens.dto.ApiResponse;
import com.careerlens.dto.InterviewAnswerRequest;
import com.careerlens.dto.InterviewAnswerResponse;
import com.careerlens.dto.InterviewFeedbackResponse;
import com.careerlens.dto.InterviewQuestionResponse;
import com.careerlens.dto.InterviewSessionResponse;
import com.careerlens.dto.InterviewStatsResponse;
import com.careerlens.dto.StartInterviewRequest;
import com.careerlens.service.InterviewService;
import com.careerlens.service.InterviewStatsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewStatsService interviewStatsService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<InterviewSessionResponse>> startInterview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StartInterviewRequest request
    ) {
        InterviewSessionResponse response = interviewService.startInterview(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interview session started successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterviewSessionResponse>> getSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        InterviewSessionResponse response = interviewService.getSession(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Interview session retrieved successfully", response));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<ApiResponse<List<InterviewQuestionResponse>>> getQuestions(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        List<InterviewQuestionResponse> response = interviewService.getQuestions(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Interview questions retrieved successfully", response));
    }

    @PostMapping("/{sessionId}/answers/{questionId}")
    public ResponseEntity<ApiResponse<InterviewAnswerResponse>> submitAnswer(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long sessionId,
            @PathVariable Long questionId,
            @Valid @RequestBody InterviewAnswerRequest request
    ) {
        InterviewAnswerResponse response = interviewService.submitAnswer(
                userDetails.getUsername(),
                sessionId,
                questionId,
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Answer submitted successfully", response));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<InterviewFeedbackResponse>> completeSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        InterviewFeedbackResponse response = interviewService.completeSession(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Interview completed successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<com.careerlens.dto.InterviewHistoryResponse>>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<com.careerlens.dto.InterviewHistoryResponse> response = interviewService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Interview history retrieved successfully", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<InterviewStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        InterviewStatsResponse response = interviewStatsService.getStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Interview statistics retrieved successfully", response));
    }
}
