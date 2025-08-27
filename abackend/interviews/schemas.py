from pydantic import BaseModel
from ninja import Schema
class SessionOut(Schema):
    id: int
    session_name: str
    category: str
    num_questions: int
    result: str