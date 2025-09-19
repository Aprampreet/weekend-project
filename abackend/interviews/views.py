from ninja import NinjaAPI,Form,File
from users.Auth import JWTAuth
from .schemas import *
from ninja.files import UploadedFile
from .models import Session
from typing import List
from .utlis import *
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from django.db.models import Sum

api = NinjaAPI(urls_namespace="interviews_api")


@api.get("/dashboard", response=List[SessionOut], auth=JWTAuth())
def dashboard(request):
    user = request.user
    sessions = Session.objects.filter(user=user).order_by("-id")
    return [
        {
            "id": s.id,
            "session_name": s.session_name,
            "job_discription": s.job_discription,
            "category": s.category,
            "num_questions": s.num_questions,
            "result": s.result,
            "resume": s.resume.url if s.resume else None,
        }
        for s in sessions
    ]



@api.post("/create-session", response=SessionOut, auth=JWTAuth())
def create_session(
    request,
    session_name: str = Form(...),
    job_discription: str = Form(...),
    category: str = Form(...),
    num_questions: int = Form(...),
    resume: UploadedFile = File(None)
):
    session = Session.objects.create(
        user=request.user,
        session_name=session_name,
        job_discription=job_discription,
        category=category,
        num_questions=num_questions,
        result="Pending",
        resume=resume  
    )
    questions = generate_questions(session)

    for q in questions:
        Questions.objects.create(session=session, quest=q)
    return session


@api.get('/questions/{session_id}',auth=JWTAuth())
def question(request,session_id:int):
    session = get_object_or_404(Session, id=session_id, user=request.user)
    questions = Questions.objects.filter(session=session).values("id", "quest")
    return {
        "session_id": session.id,
        "questions": list(questions)
    }


@api.post('/questions/{question_id}/answer',auth=JWTAuth())
def put_answer(request, question_id: int, data: AnswerIn):
    question = get_object_or_404(Questions,id=question_id,session__user=request.user)
    question.answer= data.answer

    x = get_feedback_and_score(question.quest, data.answer)
    question.feedback = x["feedback"]
    question.score = x["score"]

    question.save()

    session = question.session
    total_score = session.questions.aggregate(total=Sum('score'))['total'] or 0
    session.result = f"{total_score} / {session.num_questions * 10}"
    session.save()

    return {
        "id": question.id,
        "quest": question.quest,
        "answer": question.answer,
        "feedback": question.feedback,
        "score": question.score,
        "session_result": session.result
    }

@api.get('/session/{session_id}/score',auth=JWTAuth())
def get_score(request,session_id:int):
    session = get_object_or_404(Session, id=session_id, user=request.user)
    total_score = session.total_score()
    max_score = session.num_questions*10
    session.result = f"{total_score} / {max_score}"
    session.save()

    return {
        "session_id": session.id,
        "total_score": total_score,
        "max_score": max_score,
        "result": session.result,
    }