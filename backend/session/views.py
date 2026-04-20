from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import PracticeSession
from chat.models import Room
from backend.throttles import SessionAdminThrottle, SessionReadThrottle, SessionWriteThrottle


def get_active_session_for_user(user):
    accepted_session = (
        PracticeSession.objects
        .filter(user=user, status="accepted", room__is_active=True)
        .order_by("-created_at")
        .first()
    )
    if accepted_session:
        PracticeSession.objects.filter(
            user=user,
            status="pending"
        ).exclude(id=accepted_session.id).update(status="rejected")
        return accepted_session

    pending_session = (
        PracticeSession.objects
        .filter(user=user, status="pending")
        .order_by("-created_at")
        .first()
    )
    if pending_session:
        PracticeSession.objects.filter(
            user=user,
            status="pending"
        ).exclude(id=pending_session.id).update(status="rejected")

    return pending_session



class CreateSessionRequest(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SessionWriteThrottle]

    def post(self, request):
        session = get_active_session_for_user(request.user)

        if session is None or session.status == "accepted":
            session = PracticeSession.objects.create(user=request.user)

        return Response({
            "message": "Session request sent",
            "session_id": session.id,
            "status": session.status,
            "room_code": session.room.code if session.room else None,
        }, status=status.HTTP_201_CREATED)



class PendingSessionsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SessionAdminThrottle]

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
    throttle_classes = [SessionAdminThrottle]

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

        PracticeSession.objects.filter(
            user=session.user,
            status="pending"
        ).exclude(id=session.id).update(status="rejected")

        return Response({
            "message": "Session accepted",
            "room_code": room.code
        })



class SessionStatusView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SessionReadThrottle]

    def get(self, request, session_id):
        try:
            session = PracticeSession.objects.get(id=session_id, user=request.user)
        except PracticeSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=404)

        return Response({
            "status": session.status,
            "room_code": session.room.code if session.room else None
        })


class CurrentSessionView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SessionReadThrottle]

    def get(self, request):
        session = get_active_session_for_user(request.user)

        if not session:
            return Response(
                {"status": "idle", "session_id": None, "room_code": None},
                status=status.HTTP_200_OK
            )

        return Response({
            "status": session.status,
            "session_id": session.id,
            "room_code": session.room.code if session.room else None,
        })
