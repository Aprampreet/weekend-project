from ninja import NinjaAPI
from ninja.security import django_auth
from users.Auth import JWTAuth
api = NinjaAPI(urls_namespace="interviews_api")

@api.get("/dashboard", auth=JWTAuth())
def dashboard(request):
    user = request.user
    return {"message": f"Hello {user.username}, your dashboard here"}

@api.get("/profile", auth=JWTAuth())
def profile(request):
    user = request.user
    profile = user.profile
    return {
        "username": user.username,
        "email": user.email,
        "full_name": profile.full_name,
        "bio": profile.bio,
        "created_at": profile.created_at
    }