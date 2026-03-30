from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import User
from profiles.models import Activity
from analytics.models import InterviewResult
from django.utils import timezone
from datetime import timedelta


def is_admin(user):
    return user.is_authenticated and user.role == "admin"


class AdminStatsView(APIView):
    def get(self, request):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        total_users = User.objects.count()
        banned_users = User.objects.filter(is_active=False).count()
        total_interviews = InterviewResult.objects.count()
        avg_score = InterviewResult.objects.values_list("score", flat=True)
        avg = round(sum(avg_score) / len(avg_score), 1) if avg_score else 0

        recent = timezone.now() - timedelta(days=7)
        new_users = User.objects.filter(date_joined__gte=recent).count()

        return Response({
            "total_users": total_users,
            "banned_users": banned_users,
            "total_interviews": total_interviews,
            "avg_score": avg,
            "new_users_this_week": new_users,
        })


class AdminUsersView(APIView):
    def get(self, request):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        users = User.objects.all().values(
            "id", "username", "email", "role",
            "is_active", "date_joined", "phone"
        )
        return Response(list(users))

    def delete(self, request, user_id):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class AdminBanUserView(APIView):
    def post(self, request, user_id):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        if request.user.id == user_id:
            return Response({"error": "You cannot ban your own account"}, status=400)

        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            status = "unbanned" if user.is_active else "banned"
            return Response({"message": f"User {status} successfully"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class AdminActivityView(APIView):
    def get(self, request):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        logs = Activity.objects.select_related("user").all()[:100]
        data = [
            {
                "id": log.id,
                "user": log.user.username,
                "action": log.action,
                "description": log.description,
                "created_at": log.created_at,
            }
            for log in logs
        ]
        return Response(data)


class AdminInterviewsView(APIView):
    def get(self, request):
        if not is_admin(request.user):
            return Response({"error": "Unauthorized"}, status=403)

        results = InterviewResult.objects.select_related("user").all()[:100]
        data = [
            {
                "id": r.id,
                "user": r.user.username,
                "role": r.role,
                "score": r.score,
                "created_at": r.created_at,
            }
            for r in results
        ]
        return Response(data)
    
class AdminCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Unauthorized"}, status=403)
        return Response({"is_admin": True, "username": request.user.username})