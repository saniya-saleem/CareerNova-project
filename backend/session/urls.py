from django.urls import path
from .views import (
    CreateSessionRequest,
    PendingSessionsView,
    AcceptSessionView,
    SessionStatusView,
    CurrentSessionView,
)

urlpatterns = [
    path("request/", CreateSessionRequest.as_view()),
    path("current/", CurrentSessionView.as_view()),
    path("pending/", PendingSessionsView.as_view()),
    path("accept/<int:session_id>/", AcceptSessionView.as_view()),
    path("status/<int:session_id>/", SessionStatusView.as_view()),
]
