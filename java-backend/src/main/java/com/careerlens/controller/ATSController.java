package com.careerlens.controller;

import com.careerlens.dto.ApiResponse;
import com.careerlens.dto.ATSResultResponse;
import com.careerlens.dto.ATSStatsResponse;
import com.careerlens.service.ATSService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
public class ATSController {

    private final ATSService atsService;

    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ApiResponse<ATSResultResponse>> analyzeResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long resumeId
    ) {
        ATSResultResponse result = atsService.analyzeResume(userDetails.getUsername(), resumeId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume analyzed successfully", result));
    }

    @GetMapping("/result/{resumeId}")
    public ResponseEntity<ApiResponse<ATSResultResponse>> getResult(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long resumeId
    ) {
        ATSResultResponse result = atsService.getResult(userDetails.getUsername(), resumeId);
        return ResponseEntity.ok(ApiResponse.success("ATS result retrieved successfully", result));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ATSResultResponse>>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ATSResultResponse> history = atsService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("ATS history retrieved successfully", history));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ATSStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ATSStatsResponse stats = atsService.getStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("ATS statistics retrieved successfully", stats));
    }
}
