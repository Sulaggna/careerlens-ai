from pydantic import BaseModel
from typing import List, Optional

class GenerateQuestionsRequest(BaseModel):
    job_title: str
    job_description: Optional[str] = None
    resume_text: Optional[str] = None
    question_count: int = 10

class Question(BaseModel):
    question_text: str
    category: str
    difficulty: str

class GenerateQuestionsResponse(BaseModel):
    questions: List[Question]

class EvaluateAnswerRequest(BaseModel):
    question_text: str
    answer_text: str
    category: Optional[str] = None

class EvaluateAnswerResponse(BaseModel):
    score: int
    feedback: str
