from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    country = models.CharField(max_length=100, blank=True, default="")
    mobile = models.CharField(max_length=13, blank=True, default="")
    profile_pic = models.FileField(upload_to="profile_pics/", default="default.jpg")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
