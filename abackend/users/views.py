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
    full_name: str = Form(None),
    bio: str = Form(None),
    country: str = Form(None),
    mobile: str = Form(None),
    profile_pic: Optional[UploadedFile] = File(None),
):
    user = request.user
    profile = getattr(user, "profile", None)
    if not profile:
        return {"error": "Profile not found"}

    if full_name is not None:
        profile.full_name = full_name
    if bio is not None:
        profile.bio = bio
    if country is not None:
        profile.country = country
    if mobile is not None:
        profile.mobile = mobile
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
