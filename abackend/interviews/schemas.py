from pydantic import BaseModel
from ninja import Schema
from typing import List


class SessionOut(Schema):
    id: int
    session_name: str
    job_discription: str
    category: str
    num_questions: int
    result: str
    resume: str | None = None


class AnswerIn(Schema):
    answer: str

class AnswerOut(Schema):
    id: int
    quest: str
    answer: str
    feedback: str
    score: int | None

class QuestionScoreOut(Schema):
    id: int
    text: str
    score: int
    max_score: int


class SessionDashboardOut(Schema):
    session_id: int
    total_score: int
    max_score: int
    correct_answers: int
    incorrect_answers: int
    questions: List[QuestionScoreOut]


