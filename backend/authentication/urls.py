from django.urls import path
from .views import RegisterView, LoginView, GoogleLogin
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),   
    path("refresh/", TokenRefreshView.as_view()),
    path("google/", GoogleLogin.as_view(), name="google_login"),
]