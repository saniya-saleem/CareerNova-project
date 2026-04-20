from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profile, Activity
from .serializers import ProfileSerializer
from .utils import log_activity


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_activity(request.user, "Profile Updated", "Your profile was updated successfully.")
            return Response(serializer.data)
        return Response(serializer.errors)


class ActivityListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities = Activity.objects.filter(user=request.user)
        data = [
            {
                "id": a.id,
                "action": a.action,
                "description": a.description,
                "created_at": a.created_at,
            }
            for a in activities
        ]
        return Response(data)