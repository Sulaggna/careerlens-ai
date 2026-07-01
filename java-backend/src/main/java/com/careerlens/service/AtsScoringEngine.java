package com.careerlens.service;

import com.careerlens.dto.ATSAnalysisDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Component
public class AtsScoringEngine {

    private static final List<String> KEYWORDS = List.of(
            "java", "python", "javascript", "typescript", "react", "spring", "sql", "aws",
            "docker", "kubernetes", "git", "agile", "scrum", "api", "rest", "microservices",
            "leadership", "communication", "problem solving", "team", "project management",
            "ci/cd", "devops", "cloud", "database", "testing", "analytics", "machine learning"
    );

    private static final List<String> SKILLS = List.of(
            "java", "python", "javascript", "typescript", "react", "angular", "vue", "node.js",
            "node", "spring boot", "spring", "mysql", "postgresql", "mongodb", "redis",
            "aws", "azure", "gcp", "docker", "kubernetes", "git", "html", "css", "c++", "c#",
            "go", "rust", "kotlin", "swift", "figma", "jira", "linux", "terraform"
    );

    private static final List<String> WEAK_KEYWORD_CANDIDATES = List.of(
            "responsible for", "duties included", "helped with", "worked on", "assisted",
            "various", "etc", "stuff", "things"
    );

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("(\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN =
            Pattern.compile("linkedin\\.com/in/[\\w-]+", Pattern.CASE_INSENSITIVE);

    public record ScoreResult(
            int keywordsScore,
            int skillsScore,
            int experienceScore,
            int educationScore,
            int contactScore,
            int formattingScore,
            int atsScore,
            ATSAnalysisDetails details
    ) {}

    public ScoreResult analyze(String rawText) {
        String text = rawText == null ? "" : rawText;
        String lower = text.toLowerCase(Locale.ROOT);

        List<String> foundKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();
        for (String keyword : KEYWORDS) {
            if (lower.contains(keyword)) {
                foundKeywords.add(keyword);
            } else {
                missingKeywords.add(keyword);
            }
        }
        int keywordsScore = scoreRatio(foundKeywords.size(), KEYWORDS.size());

        List<String> foundSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        for (String skill : SKILLS) {
            if (lower.contains(skill)) {
                foundSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }
        int skillsScore = scoreRatio(foundSkills.size(), Math.min(SKILLS.size(), 20));

        List<String> missingSections = new ArrayList<>();
        int experienceScore = hasSection(lower, List.of("experience", "work history", "employment", "professional experience")) ? 100 : 0;
        if (experienceScore == 0) missingSections.add("Experience");

        int educationScore = hasSection(lower, List.of("education", "academic", "qualifications", "degree")) ? 100 : 0;
        if (educationScore == 0) missingSections.add("Education");

        if (!hasSection(lower, List.of("skills", "technical skills", "core competencies", "technologies"))) {
            missingSections.add("Skills");
        }

        int contactScore = calculateContactScore(text, lower);

        int formattingScore = calculateFormattingScore(text);

        List<String> weakKeywords = new ArrayList<>();
        for (String weak : WEAK_KEYWORD_CANDIDATES) {
            if (lower.contains(weak)) {
                weakKeywords.add(weak);
            }
        }

        List<String> recommendations = generateRecommendations(
                keywordsScore, skillsScore, experienceScore, educationScore, contactScore,
                formattingScore, missingKeywords, missingSkills, missingSections, weakKeywords
        );

        int atsScore = (int) Math.round(
                keywordsScore * 0.30
                        + skillsScore * 0.25
                        + experienceScore * 0.15
                        + educationScore * 0.10
                        + contactScore * 0.10
                        + formattingScore * 0.10
        );

        ATSAnalysisDetails details = ATSAnalysisDetails.builder()
                .missingKeywords(limitList(missingKeywords, 10))
                .missingSkills(limitList(missingSkills, 10))
                .missingSections(missingSections)
                .weakKeywords(weakKeywords)
                .recommendations(recommendations)
                .build();

        return new ScoreResult(
                keywordsScore, skillsScore, experienceScore, educationScore,
                contactScore, formattingScore, atsScore, details
        );
    }

    private int scoreRatio(int found, int total) {
        if (total <= 0) return 0;
        return Math.min(100, (int) Math.round((found * 100.0) / total));
    }

    private boolean hasSection(String lowerText, List<String> headings) {
        return headings.stream().anyMatch(lowerText::contains);
    }

    private int calculateContactScore(String text, String lower) {
        int score = 0;
        if (EMAIL_PATTERN.matcher(text).find()) score += 40;
        if (PHONE_PATTERN.matcher(text).find()) score += 30;
        if (LINKEDIN_PATTERN.matcher(lower).find() || lower.contains("linkedin")) score += 30;
        return Math.min(100, score);
    }

    private int calculateFormattingScore(String text) {
        if (text.isBlank()) return 0;

        int score = 40;
        int wordCount = text.trim().split("\\s+").length;
        if (wordCount >= 200) score += 20;
        else if (wordCount >= 100) score += 10;

        if (text.contains("•") || text.contains("- ") || text.contains("* ")) {
            score += 20;
        }

        long lineCount = Arrays.stream(text.split("\\R")).filter(line -> !line.isBlank()).count();
        if (lineCount >= 10 && lineCount <= 120) {
            score += 20;
        } else if (lineCount >= 5) {
            score += 10;
        }

        return Math.min(100, score);
    }

    private List<String> generateRecommendations(
            int keywordsScore, int skillsScore, int experienceScore, int educationScore,
            int contactScore, int formattingScore,
            List<String> missingKeywords, List<String> missingSkills,
            List<String> missingSections, List<String> weakKeywords
    ) {
        List<String> recommendations = new ArrayList<>();

        if (keywordsScore < 70) {
            recommendations.add("Add industry-specific keywords such as: "
                    + String.join(", ", limitList(missingKeywords, 5)) + ".");
        }
        if (skillsScore < 70) {
            recommendations.add("Include relevant technical skills like: "
                    + String.join(", ", limitList(missingSkills, 5)) + ".");
        }
        if (experienceScore < 100) {
            recommendations.add("Add a clearly labeled Experience section with quantified achievements.");
        }
        if (educationScore < 100) {
            recommendations.add("Add an Education section with degree, institution, and graduation year.");
        }
        if (contactScore < 100) {
            recommendations.add("Ensure your resume includes email, phone number, and LinkedIn profile URL.");
        }
        if (formattingScore < 70) {
            recommendations.add("Improve formatting with bullet points, consistent spacing, and clear section headings.");
        }
        if (!weakKeywords.isEmpty()) {
            recommendations.add("Replace weak phrases like \"" + weakKeywords.get(0)
                    + "\" with action verbs and measurable results.");
        }
        if (recommendations.isEmpty()) {
            recommendations.add("Your resume is well optimized. Tailor keywords to each job description before applying.");
        }

        return recommendations;
    }

    private List<String> limitList(List<String> items, int max) {
        return items.size() <= max ? items : items.subList(0, max);
    }
}
