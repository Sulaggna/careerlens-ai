package com.careerlens.dto;

import com.careerlens.entity.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {

    private Long id;
    private Long userId;
    private String fileName;
    private String originalFileName;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private String resumeTitle;

    public static ResumeResponse fromEntity(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .userId(resume.getUserId())
                .fileName(resume.getFileName())
                .originalFileName(resume.getOriginalFileName())
                .fileSize(resume.getFileSize())
                .uploadDate(resume.getUploadDate())
                .resumeTitle(resume.getResumeTitle())
                .build();
    }
}
