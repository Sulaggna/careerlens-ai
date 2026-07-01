package com.careerlens.service;

import com.careerlens.dto.ATSAnalysisDetails;
import com.careerlens.dto.ATSResultResponse;
import com.careerlens.dto.ATSStatsResponse;
import com.careerlens.entity.ATSResult;
import com.careerlens.entity.Resume;
import com.careerlens.entity.User;
import com.careerlens.repository.ATSRepository;
import com.careerlens.repository.ResumeRepository;
import com.careerlens.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ATSService {

    private final ATSRepository atsRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfTextExtractor pdfTextExtractor;
    private final AtsScoringEngine atsScoringEngine;
    private final ObjectMapper objectMapper;

    @Transactional
    public ATSResultResponse analyzeResume(String userEmail, Long resumeId) {
        User user = getUser(userEmail);
        Resume resume = getOwnedResume(user.getId(), resumeId);

        String text;
        try {
            text = pdfTextExtractor.extractText(Path.of(resume.getFilePath()));
        } catch (IOException ex) {
            throw new InvalidFileException("Failed to read PDF file: " + ex.getMessage());
        }

        if (text == null || text.isBlank()) {
            throw new InvalidFileException("Could not extract text from PDF. The file may be scanned or empty.");
        }

        AtsScoringEngine.ScoreResult scoreResult = atsScoringEngine.analyze(text);

        ATSResult entity = atsRepository.findByResumeIdAndUserId(resumeId, user.getId())
                .orElse(ATSResult.builder()
                        .resumeId(resumeId)
                        .userId(user.getId())
                        .build());

        entity.setAtsScore(scoreResult.atsScore());
        entity.setKeywordsScore(scoreResult.keywordsScore());
        entity.setSkillsScore(scoreResult.skillsScore());
        entity.setExperienceScore(scoreResult.experienceScore());
        entity.setEducationScore(scoreResult.educationScore());
        entity.setContactScore(scoreResult.contactScore());
        entity.setFormattingScore(scoreResult.formattingScore());
        entity.setRecommendations(toJson(scoreResult.details()));

        ATSResult saved = atsRepository.save(entity);
        return toResponse(saved, resume);
    }

    public ATSResultResponse getResult(String userEmail, Long resumeId) {
        User user = getUser(userEmail);
        Resume resume = getOwnedResume(user.getId(), resumeId);

        ATSResult result = atsRepository.findByResumeIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No ATS analysis found for this resume"));

        return toResponse(result, resume);
    }

    public List<ATSResultResponse> getHistory(String userEmail) {
        User user = getUser(userEmail);

        return atsRepository.findByUserIdOrderByAnalysisDateDesc(user.getId()).stream()
                .map(result -> {
                    Resume resume = resumeRepository.findById(result.getResumeId()).orElse(null);
                    return toResponse(result, resume);
                })
                .toList();
    }

    public ATSStatsResponse getStats(String userEmail) {
        User user = getUser(userEmail);
        List<ATSResult> results = atsRepository.findByUserIdOrderByAnalysisDateDesc(user.getId());

        if (results.isEmpty()) {
            return ATSStatsResponse.builder()
                    .totalAnalyses(0)
                    .averageScore(0)
                    .bestScore(0)
                    .build();
        }

        double average = results.stream()
                .mapToInt(ATSResult::getAtsScore)
                .average()
                .orElse(0);

        int best = results.stream()
                .map(ATSResult::getAtsScore)
                .max(Comparator.naturalOrder())
                .orElse(0);

        return ATSStatsResponse.builder()
                .totalAnalyses(results.size())
                .averageScore(Math.round(average * 10.0) / 10.0)
                .bestScore(best)
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Resume getOwnedResume(Long userId, Long resumeId) {
        return resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ForbiddenException("You do not have access to this resume"));
    }

    private ATSResultResponse toResponse(ATSResult entity, Resume resume) {
        ATSAnalysisDetails details = fromJson(entity.getRecommendations());

        return ATSResultResponse.builder()
                .id(entity.getId())
                .resumeId(entity.getResumeId())
                .userId(entity.getUserId())
                .resumeTitle(resume != null ? resume.getResumeTitle() : null)
                .originalFileName(resume != null ? resume.getOriginalFileName() : null)
                .atsScore(entity.getAtsScore())
                .keywordsScore(entity.getKeywordsScore())
                .skillsScore(entity.getSkillsScore())
                .experienceScore(entity.getExperienceScore())
                .educationScore(entity.getEducationScore())
                .contactScore(entity.getContactScore())
                .formattingScore(entity.getFormattingScore())
                .missingKeywords(details.getMissingKeywords())
                .missingSkills(details.getMissingSkills())
                .missingSections(details.getMissingSections())
                .weakKeywords(details.getWeakKeywords())
                .recommendations(details.getRecommendations())
                .analysisDate(entity.getAnalysisDate())
                .build();
    }

    private String toJson(ATSAnalysisDetails details) {
        try {
            return objectMapper.writeValueAsString(details);
        } catch (JsonProcessingException ex) {
            throw new InvalidFileException("Failed to serialize analysis details");
        }
    }

    private ATSAnalysisDetails fromJson(String json) {
        try {
            return objectMapper.readValue(json, ATSAnalysisDetails.class);
        } catch (JsonProcessingException ex) {
            return ATSAnalysisDetails.builder()
                    .missingKeywords(List.of())
                    .missingSkills(List.of())
                    .missingSections(List.of())
                    .weakKeywords(List.of())
                    .recommendations(List.of("Analysis data unavailable"))
                    .build();
        }
    }
}
