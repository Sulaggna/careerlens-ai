import random
from typing import List
from app.api.models import Question

BEHAVIORAL_QUESTIONS = [
    ("Tell me about yourself and your experience as a {role}.", "Behavioral", "easy"),
    ("Describe a challenging situation you faced at work and how you handled it.", "Behavioral", "medium"),
    ("Tell me about a time you had to work with a difficult team member.", "Behavioral", "medium"),
    ("Describe a project you're particularly proud of and your contribution.", "Behavioral", "medium"),
    ("How do you handle tight deadlines and pressure?", "Behavioral", "easy"),
    ("Tell me about a time you made a mistake and how you fixed it.", "Behavioral", "medium"),
    ("How do you prioritize your work when you have multiple tasks?", "Behavioral", "easy"),
    ("Describe your ideal work environment.", "Behavioral", "easy"),
    ("Where do you see yourself in 5 years?", "Behavioral", "easy"),
    ("Why do you want to work as a {role}?", "Behavioral", "easy"),
]

TECHNICAL_QUESTIONS = [
    ("Explain the difference between REST and GraphQL APIs.", "Technical", "medium"),
    ("What is the difference between SQL and NoSQL databases?", "Technical", "medium"),
    ("Explain the concept of microservices architecture.", "Technical", "hard"),
    ("What is CI/CD and why is it important?", "Technical", "medium"),
    ("Explain the difference between monolithic and microservices architecture.", "Technical", "hard"),
    ("What is Docker and how does it work?", "Technical", "medium"),
    ("Explain the concept of containerization.", "Technical", "medium"),
    ("What is Kubernetes and what problem does it solve?", "Technical", "hard"),
    ("Explain the difference between authentication and authorization.", "Technical", "medium"),
    ("What is the difference between GET and POST requests?", "Technical", "easy"),
]

SYSTEM_DESIGN_QUESTIONS = [
    ("How would you design a scalable web application?", "System Design", "hard"),
    ("Design a URL shortener service.", "System Design", "hard"),
    ("How would you design a chat application?", "System Design", "hard"),
    ("Design a file storage system like Google Drive.", "System Design", "hard"),
    ("How would you design a real-time analytics system?", "System Design", "hard"),
    ("Design a rate limiter for an API.", "System Design", "medium"),
    ("How would you handle database sharding?", "System Design", "hard"),
    ("Design a notification system.", "System Design", "medium"),
    ("How would you design a search engine?", "System Design", "hard"),
    ("Design a caching strategy for a high-traffic website.", "System Design", "medium"),
]

ROLE_SPECIFIC_QUESTIONS = [
    ("What experience do you have with cloud platforms (AWS, Azure, GCP)?", "Technical", "medium"),
    ("How do you ensure code quality in your projects?", "Technical", "medium"),
    ("What is your experience with agile methodologies?", "Behavioral", "easy"),
    ("How do you stay updated with the latest technology trends?", "Behavioral", "easy"),
    ("Describe your experience with test-driven development.", "Technical", "medium"),
]

def generate_questions(job_title: str, question_count: int) -> List[Question]:
    all_questions = BEHAVIORAL_QUESTIONS + TECHNICAL_QUESTIONS + SYSTEM_DESIGN_QUESTIONS + ROLE_SPECIFIC_QUESTIONS
    selected_templates = random.sample(all_questions, min(question_count, len(all_questions)))
    
    questions = []
    for i, (template, category, difficulty) in enumerate(selected_templates):
        question_text = template.replace("{role}", job_title)
        questions.append(Question(
            question_text=question_text,
            category=category,
            difficulty=difficulty
        ))
    
    return questions
