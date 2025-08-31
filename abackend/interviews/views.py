from ninja import NinjaAPI,File,Form
from ninja.security import django_auth
from users.Auth import JWTAuth
from .schemas import *
from ninja.files import UploadedFile
from .models import Session
api = NinjaAPI(urls_namespace="interviews_api")
from typing import List


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
        resume=resume if resume else None
    )

    return session

