from ninja import NinjaAPI,File,Form
from ninja.security import django_auth
from users.Auth import JWTAuth
from .schemas import *
from ninja.files import UploadedFile
from .models import Session
api = NinjaAPI(urls_namespace="interviews_api")

@api.get("/dashboard", auth=JWTAuth())
def dashboard(request):
    user = request.user
    return {"message": f"Hello {user.username}, your dashboard here"}



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

