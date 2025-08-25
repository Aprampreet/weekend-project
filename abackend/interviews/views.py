from ninja import NinjaAPI
from ninja.security import django_auth
from users.Auth import JWTAuth
from .schemas import *
api = NinjaAPI(urls_namespace="interviews_api")

@api.get("/dashboard", auth=JWTAuth())
def dashboard(request):
    user = request.user
    return {"message": f"Hello {user.username}, your dashboard here"}



