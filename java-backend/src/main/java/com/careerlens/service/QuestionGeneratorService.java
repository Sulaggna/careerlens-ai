package com.careerlens.service;

import com.careerlens.entity.InterviewQuestion;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class QuestionGeneratorService {

    private static final List<QuestionTemplate> BEHAVIORAL_QUESTIONS = List.of(
            new QuestionTemplate("Tell me about yourself and your experience as a {role}.", "Behavioral", "easy"),
            new QuestionTemplate("Describe a challenging situation you faced at work and how you handled it.", "Behavioral", "medium"),
            new QuestionTemplate("Tell me about a time you had to work with a difficult team member.", "Behavioral", "medium"),
            new QuestionTemplate("Describe a project you're particularly proud of and your contribution.", "Behavioral", "medium"),
            new QuestionTemplate("How do you handle tight deadlines and pressure?", "Behavioral", "easy"),
            new QuestionTemplate("Tell me about a time you made a mistake and how you fixed it.", "Behavioral", "medium"),
            new QuestionTemplate("How do you prioritize your work when you have multiple tasks?", "Behavioral", "easy"),
            new QuestionTemplate("Describe your ideal work environment.", "Behavioral", "easy"),
            new QuestionTemplate("Where do you see yourself in 5 years?", "Behavioral", "easy"),
            new QuestionTemplate("Why do you want to work as a {role}?", "Behavioral", "easy")
    );

    private static final List<QuestionTemplate> TECHNICAL_QUESTIONS = List.of(
            new QuestionTemplate("Explain the difference between REST and GraphQL APIs.", "Technical", "medium"),
            new QuestionTemplate("What is the difference between SQL and NoSQL databases?", "Technical", "medium"),
            new QuestionTemplate("Explain the concept of microservices architecture.", "Technical", "hard"),
            new QuestionTemplate("What is CI/CD and why is it important?", "Technical", "medium"),
            new QuestionTemplate("Explain the difference between monolithic and microservices architecture.", "Technical", "hard"),
            new QuestionTemplate("What is Docker and how does it work?", "Technical", "medium"),
            new QuestionTemplate("Explain the concept of containerization.", "Technical", "medium"),
            new QuestionTemplate("What is Kubernetes and what problem does it solve?", "Technical", "hard"),
            new QuestionTemplate("Explain the difference between authentication and authorization.", "Technical", "medium"),
            new QuestionTemplate("What is the difference between GET and POST requests?", "Technical", "easy")
    );

    private static final List<QuestionTemplate> SYSTEM_DESIGN_QUESTIONS = List.of(
            new QuestionTemplate("How would you design a scalable web application?", "System Design", "hard"),
            new QuestionTemplate("Design a URL shortener service.", "System Design", "hard"),
            new QuestionTemplate("How would you design a chat application?", "System Design", "hard"),
            new QuestionTemplate("Design a file storage system like Google Drive.", "System Design", "hard"),
            new QuestionTemplate("How would you design a real-time analytics system?", "System Design", "hard"),
            new QuestionTemplate("Design a rate limiter for an API.", "System Design", "medium"),
            new QuestionTemplate("How would you handle database sharding?", "System Design", "hard"),
            new QuestionTemplate("Design a notification system.", "System Design", "medium"),
            new QuestionTemplate("How would you design a search engine?", "System Design", "hard"),
            new QuestionTemplate("Design a caching strategy for a high-traffic website.", "System Design", "medium")
    );

    private static final List<QuestionTemplate> ROLE_SPECIFIC_QUESTIONS = List.of(
            new QuestionTemplate("What experience do you have with cloud platforms (AWS, Azure, GCP)?", "Technical", "medium"),
            new QuestionTemplate("How do you ensure code quality in your projects?", "Technical", "medium"),
            new QuestionTemplate("What is your experience with agile methodologies?", "Behavioral", "easy"),
            new QuestionTemplate("How do you stay updated with the latest technology trends?", "Behavioral", "easy"),
            new QuestionTemplate("Describe your experience with test-driven development.", "Technical", "medium")
    );

    private final Random random = new Random();

    public List<InterviewQuestion> generateQuestions(String jobTitle, int count) {
        List<QuestionTemplate> allQuestions = new ArrayList<>();
        allQuestions.addAll(BEHAVIORAL_QUESTIONS);
        allQuestions.addAll(TECHNICAL_QUESTIONS);
        allQuestions.addAll(SYSTEM_DESIGN_QUESTIONS);
        allQuestions.addAll(ROLE_SPECIFIC_QUESTIONS);

        List<QuestionTemplate> selected = new ArrayList<>();
        List<QuestionTemplate> remaining = new ArrayList<>(allQuestions);

        for (int i = 0; i < count && !remaining.isEmpty(); i++) {
            int index = random.nextInt(remaining.size());
            QuestionTemplate template = remaining.remove(index);
            String questionText = template.question().replace("{role}", jobTitle);
            selected.add(new QuestionTemplate(questionText, template.category(), template.difficulty()));
        }

        List<InterviewQuestion> questions = new ArrayList<>();
        for (int i = 0; i < selected.size(); i++) {
            QuestionTemplate template = selected.get(i);
            InterviewQuestion question = new InterviewQuestion();
            question.setQuestionText(template.question());
            question.setCategory(template.category());
            question.setDifficulty(template.difficulty());
            question.setOrderIndex(i);
            questions.add(question);
        }

        return questions;
    }

    private record QuestionTemplate(String question, String category, String difficulty) {}
}
