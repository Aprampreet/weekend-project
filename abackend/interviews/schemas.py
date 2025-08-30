from pydantic import BaseModel
from ninja import Schema


class SessionOut(Schema):
    id: int
    session_name: str
    job_discription: str
    category: str
    num_questions: int
    result: str
    resume: str | None = None
