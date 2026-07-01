package com.careerlens.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ats_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resume_id", nullable = false)
    private Long resumeId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "ats_score", nullable = false)
    private Integer atsScore;

    @Column(name = "keywords_score", nullable = false)
    private Integer keywordsScore;

    @Column(name = "skills_score", nullable = false)
    private Integer skillsScore;

    @Column(name = "experience_score", nullable = false)
    private Integer experienceScore;

    @Column(name = "education_score", nullable = false)
    private Integer educationScore;

    @Column(name = "contact_score", nullable = false)
    private Integer contactScore;

    @Column(name = "formatting_score", nullable = false)
    private Integer formattingScore;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String recommendations;

    @Column(name = "analysis_date", nullable = false)
    private LocalDateTime analysisDate;

    @PrePersist
    protected void onCreate() {
        if (analysisDate == null) {
            analysisDate = LocalDateTime.now();
        }
    }
}
