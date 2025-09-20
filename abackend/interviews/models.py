from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum
from django.db.models import F

CATEGORY_CHOICES = [
        ("Web Development", "Web Development"),
        ("C++", "C++"),
        ("Machine Learning", "Machine Learning"),
        ("Data Science", "Data Science"),
    ]

class Session(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    session_name = models.CharField(max_length=250)
    resume = models.FileField(upload_to="resume/",null=True,blank=True)
    job_discription = models.TextField()
    category = models.CharField(max_length=50,choices=CATEGORY_CHOICES, default="Web Development"  )
    num_questions = models.IntegerField()
    result = models.CharField(max_length=50, default="Pending")

    def __str__(self):
        return f'{self.user}-{self.session_name}'
    
    def total_score(self):
        return sum(q.score or 0 for q in self.questions.all())

    
class Questions(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="questions")
    quest = models.CharField(max_length=500)
    answer = models.TextField(blank=True, null=True)   
    feedback = models.TextField(default='', blank=True)
    score = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.session} - {self.quest[:50]}'
    