from fastapi import APIRouter
from app.api.models import GenerateQuestionsRequest, GenerateQuestionsResponse, EvaluateAnswerRequest, EvaluateAnswerResponse
from app.services.question_generator import generate_questions
from app.services.answer_evaluator import evaluate_answer

router = APIRouter()

@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
async def generate_questions_endpoint(request: GenerateQuestionsRequest):
    questions = generate_questions(request.job_title, request.question_count)
    return GenerateQuestionsResponse(questions=questions)

@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer_endpoint(request: EvaluateAnswerRequest):
    result = evaluate_answer(request.question_text, request.answer_text, request.category)
    return result
