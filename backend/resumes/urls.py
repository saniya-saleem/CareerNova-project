from django.urls import path
from .views import ResumeUploadView, ChatWithAIView

urlpatterns = [
    path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("chat/", ChatWithAIView.as_view()),
]
