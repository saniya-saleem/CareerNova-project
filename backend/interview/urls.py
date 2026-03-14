from django.urls import path
from .views import GenerateQuestionsView, EvaluateAnswersView

urlpatterns = [
    path("generate/", GenerateQuestionsView.as_view()),
     path("evaluate/", EvaluateAnswersView.as_view(), name="evaluate-answers"),
]