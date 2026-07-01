package com.careerlens.service;

import com.careerlens.config.FileStorageConfig;
import com.careerlens.dto.ResumeResponse;
import com.careerlens.entity.Resume;
import com.careerlens.entity.User;
import com.careerlens.repository.ResumeRepository;
import com.careerlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String PDF_CONTENT_TYPE = "application/pdf";

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final FileStorageConfig fileStorageConfig;

    @Transactional
    public ResumeResponse uploadResume(String userEmail, MultipartFile file, String resumeTitle) {
        validatePdfFile(file);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String originalFileName = sanitizeFileName(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + "_" + originalFileName;

        Path userDir = fileStorageConfig.getUploadPath().resolve(String.valueOf(user.getId()));
        try {
            Files.createDirectories(userDir);
            Path targetPath = userDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath);

            String title = (resumeTitle != null && !resumeTitle.isBlank())
                    ? resumeTitle.trim()
                    : deriveTitleFromFileName(originalFileName);

            Resume resume = Resume.builder()
                    .userId(user.getId())
                    .fileName(storedFileName)
                    .originalFileName(originalFileName)
                    .filePath(targetPath.toString())
                    .fileSize(file.getSize())
                    .resumeTitle(title)
                    .build();

            Resume saved = resumeRepository.save(resume);
            return ResumeResponse.fromEntity(saved);
        } catch (IOException ex) {
            throw new InvalidFileException("Failed to store file: " + ex.getMessage());
        }
    }

    public List<ResumeResponse> getUserResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return resumeRepository.findByUserIdOrderByUploadDateDesc(user.getId())
                .stream()
                .map(ResumeResponse::fromEntity)
                .toList();
    }

    public ResumeResponse getResumeById(String userEmail, Long id) {
        Resume resume = getOwnedResume(userEmail, id);
        return ResumeResponse.fromEntity(resume);
    }

    public Resource downloadResume(String userEmail, Long id) {
        Resume resume = getOwnedResume(userEmail, id);

        try {
            Path filePath = Path.of(resume.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Resume file not found on disk");
            }

            return resource;
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file not found");
        }
    }

    public String getOriginalFileName(String userEmail, Long id) {
        Resume resume = getOwnedResume(userEmail, id);
        return resume.getOriginalFileName();
    }

    @Transactional
    public void deleteResume(String userEmail, Long id) {
        Resume resume = getOwnedResume(userEmail, id);

        try {
            Path filePath = Path.of(resume.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new InvalidFileException("Failed to delete file: " + ex.getMessage());
        }

        resumeRepository.delete(resume);
    }

    public long countUserResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return resumeRepository.countByUserId(user.getId());
    }

    private Resume getOwnedResume(String userEmail, Long id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ForbiddenException("You do not have access to this resume"));
    }

    private void validatePdfFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please select a PDF file to upload");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size must not exceed 10MB");
        }

        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();

        boolean isPdfContentType = PDF_CONTENT_TYPE.equalsIgnoreCase(contentType);
        boolean isPdfExtension = originalName != null && originalName.toLowerCase().endsWith(".pdf");

        if (!isPdfContentType && !isPdfExtension) {
            throw new InvalidFileException("Only PDF files are allowed");
        }

        if (originalName == null || originalName.isBlank()) {
            throw new InvalidFileException("Invalid file name");
        }
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "resume.pdf";
        }
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String deriveTitleFromFileName(String fileName) {
        if (fileName.toLowerCase().endsWith(".pdf")) {
            return fileName.substring(0, fileName.length() - 4);
        }
        return fileName;
    }
}
