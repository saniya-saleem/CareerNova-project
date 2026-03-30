import threading
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from google.oauth2 import id_token
from google.auth.transport import requests

from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


def send_welcome_email(email, username):
    try:
        send_mail(
            "Welcome to CareerNova",
            f"Hi {username},\n\nYour CareerNova account was created successfully.\n\nHappy learning!",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=True,
        )
    except Exception as e:
        print("Email error:", e)


# 🔥 COMMON FUNCTION TO SET COOKIES
def set_auth_cookies(response, refresh):
    response.set_cookie(
        key="access_token",
        value=str(refresh.access_token),
        httponly=True,
        secure=False,
        samesite="Lax",
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite="Lax",
    )

    return response


# ───────────────── REGISTER ─────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            threading.Thread(
                target=send_welcome_email,
                args=(user.email, user.username)
            ).start()

            refresh = RefreshToken.for_user(user)

            response = Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )

            return set_auth_cookies(response, refresh)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ───────────────── LOGIN ─────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                }
            })

            return set_auth_cookies(response, refresh)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ───────────────── GOOGLE LOGIN ─────────────────
class GoogleLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("access_token")

        if not token:
            return Response({"error": "No token"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            name = idinfo.get("name")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": email.split("@")[0]}
            )

            if created:
                threading.Thread(
                    target=send_welcome_email,
                    args=(email, name)
                ).start()

            refresh = RefreshToken.for_user(user)

            response = Response({
                "email": email,
                "name": name,
                "role": user.role,
                "message": "Google login successful"
            })

            return set_auth_cookies(response, refresh)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ───────────────── REFRESH TOKEN ─────────────────
class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            request.data._mutable = True
            request.data["refresh"] = refresh_token
            request.data._mutable = False

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
            )

        return response


# ───────────────── LOGOUT ─────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {"message": "Logout successful"},
            status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        response.delete_cookie("csrftoken")

        return response


# ───────────────── USER INFO ─────────────────
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        })