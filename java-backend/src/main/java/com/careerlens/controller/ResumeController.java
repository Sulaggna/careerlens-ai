package com.careerlens.controller;

import com.careerlens.dto.ApiResponse;
import com.careerlens.dto.ResumeResponse;
import com.careerlens.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "resumeTitle", required = false) String resumeTitle
    ) {
        ResumeResponse response = resumeService.uploadResume(
                userDetails.getUsername(),
                file,
                resumeTitle
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getUserResumes(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ResumeResponse> resumes = resumeService.getUserResumes(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resumes retrieved successfully", resumes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeResponse>> getResumeById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        ResumeResponse resume = resumeService.getResumeById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Resume retrieved successfully", resume));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        Resource resource = resumeService.downloadResume(userDetails.getUsername(), id);
        String fileName = resumeService.getOriginalFileName(userDetails.getUsername(), id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        resumeService.deleteResume(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }
}
