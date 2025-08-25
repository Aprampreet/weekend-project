from django.shortcuts import render
from ninja import NinjaAPI
from django.contrib.auth import get_user_model,authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from pydantic import BaseModel

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


