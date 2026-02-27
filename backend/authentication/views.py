from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer


from django.core.mail import send_mail
from django.conf import settings


from google.oauth2 import id_token
from google.auth.transport import requests

User = get_user_model()



class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            
            try:
                send_mail(
                    "Welcome to CareerNova ",
                    f"Hi {user.username},\n\nYour CareerNova account was created successfully.\n\nHappy learning ",
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print("Email error:", e)

            return Response({"message": "User registered successfully"}, status=201)

        return Response(serializer.errors, status=400)



class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            #  generate JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "Login success"
            })

        return Response(serializer.errors, status=400)


class GoogleLogin(APIView):

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

            #  send email only for new users
            if created:
                try:
                    send_mail(
                        "Welcome to CareerNova ",
                        f"Hi {name},\n\nYour CareerNova account was created via Google login.",
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=True,
                    )
                except Exception as e:
                    print("Email error:", e)

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": email,
                "name": name
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)