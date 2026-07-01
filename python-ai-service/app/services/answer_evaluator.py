from app.api.models import EvaluateAnswerResponse

def evaluate_answer(question_text: str, answer_text: str, category: str = None) -> EvaluateAnswerResponse:
    if not answer_text or not answer_text.strip():
        return EvaluateAnswerResponse(
            score=0,
            feedback="Please provide an answer to receive feedback."
        )
    
    word_count = len(answer_text.split())
    base_score = min(60, word_count * 3)
    
    action_verbs = [
        "implemented", "developed", "designed", "created", "built",
        "led", "managed", "achieved", "improved", "optimized",
        "solved", "delivered", "launched", "deployed", "architected"
    ]
    
    verb_bonus = 0
    lower_answer = answer_text.lower()
    for verb in action_verbs:
        if verb in lower_answer:
            verb_bonus += 5
    
    quality_indicators = [
        "result", "impact", "outcome", "metric", "percentage",
        "increased", "decreased", "reduced", "improved", "saved"
    ]
    
    quality_bonus = 0
    for indicator in quality_indicators:
        if indicator in lower_answer:
            quality_bonus += 3
    
    total_score = base_score + verb_bonus + quality_bonus
    total_score = min(100, total_score)
    
    feedback = generate_feedback(question_text, answer_text, total_score)
    
    return EvaluateAnswerResponse(
        score=total_score,
        feedback=feedback
    )

def generate_feedback(question: str, answer: str, score: int) -> str:
    feedback_parts = []
    
    if score >= 80:
        feedback_parts.append("Excellent answer! You provided a comprehensive response with specific examples.")
        feedback_parts.append("Your use of action verbs and quantifiable results is impressive.")
    elif score >= 60:
        feedback_parts.append("Good answer. You covered the main points well.")
        feedback_parts.append("Consider adding more specific examples or metrics to strengthen your response.")
    elif score >= 40:
        feedback_parts.append("Your answer addresses the question but could be more detailed.")
        feedback_parts.append("Try to use the STAR method (Situation, Task, Action, Result) for better structure.")
        feedback_parts.append("Include specific examples from your experience to make your answer more compelling.")
    else:
        feedback_parts.append("Your answer needs more detail and structure.")
        feedback_parts.append("Use the STAR method to organize your response: Situation, Task, Action, Result.")
        feedback_parts.append("Provide concrete examples and quantify your achievements when possible.")
        feedback_parts.append("Focus on your specific contributions and the impact of your work.")
    
    if len(answer.split()) < 30:
        feedback_parts.append("Consider expanding your answer with more details and examples.")
    
    return " ".join(feedback_parts)
