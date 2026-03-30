from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import PracticeSession
from chat.models import Room



class CreateSessionRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = PracticeSession.objects.create(user=request.user)

        return Response({
            "message": "Session request sent",
            "session_id": session.id
        }, status=status.HTTP_201_CREATED)



class PendingSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = PracticeSession.objects.filter(status="pending")

        data = [
            {
                "id": s.id,
                "user": s.user.username,
                "created_at": s.created_at
            }
            for s in sessions
        ]

        return Response(data)


class AcceptSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = PracticeSession.objects.get(id=session_id)
        except PracticeSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        if session.status != "pending":
            return Response({"error": "Already handled"}, status=400)

      
        room = Room.objects.create(
            code=Room.generate_code(),
            created_by=request.user
        )

       
        room.participants.add(request.user)
        room.participants.add(session.user)

  
        session.admin = request.user
        session.room = room
        session.status = "accepted"
        session.save()

        return Response({
            "message": "Session accepted",
            "room_code": room.code
        })



class SessionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = PracticeSession.objects.get(id=session_id, user=request.user)
        except PracticeSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        return Response({
            "status": session.status,
            "room_code": session.room.code if session.room else None
        })