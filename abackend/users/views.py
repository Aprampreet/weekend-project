from django.shortcuts import render
from ninja import NinjaAPI
from django.contrib.auth import get_user_model,authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from pydantic import BaseModel
from .Auth import JWTAuth
from .schemas import *
from ninja import File, Form, UploadedFile

User = get_user_model()

api = NinjaAPI(urls_namespace="users_api")
class RegisterSchema(BaseModel):
    username:str
    email:str
    password:str

class LoginSchema(BaseModel):
    username: str
    password: str

@api.post('/register')
def register(request, data: RegisterSchema):
    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password
    )
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@api.post('/login')
def login(request,data:LoginSchema):
    user = authenticate(username=data.username, password=data.password)
    if not user:
        return {"error": "Invalid credentials"}
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }



@api.get("/profile", auth=JWTAuth(), response=ProfileOut)
def profile(request):
    user = request.user
    profile = getattr(user, "profile", None)
    return ProfileOut(
        username=user.username,
        email=user.email,
        full_name=profile.full_name if profile else "",
        bio=profile.bio if profile else "",
        country=profile.country if profile else "",
        mobile=profile.mobile if profile else "",
        profile_pic=profile.profile_pic.url if profile and profile.profile_pic else None,
        created_at=profile.created_at if profile else None,
    )


@api.post("/profile/update", auth=JWTAuth())
def update_profile(
    request,
    data: ProfileUpdateIn = Form(...),
    profile_pic: Optional[UploadedFile] = File(None),
):
    """
    Update profile with optional JSON fields and optional profile picture.
    """
    user = request.user
    profile = getattr(user, "profile", None)
    if not profile:
        return {"error": "Profile not found"}
    for field, value in data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    if profile_pic:
        profile.profile_pic.save(profile_pic.name, profile_pic, save=True)

    profile.save()

    return {
        "message": "Profile updated successfully",
        "profile": ProfileOut(
            username=user.username,
            email=user.email,
            full_name=profile.full_name,
            bio=profile.bio,
            country=profile.country,
            mobile=profile.mobile,
            profile_pic=profile.profile_pic.url if profile.profile_pic else None,
            created_at=profile.created_at
        )
    }