from django.urls import path
from .views import CreateRoomView, JoinRoomView, RoomDetailView, CloseRoomView, RoomListView

urlpatterns = [
    path("rooms/",                   RoomListView.as_view()),
    path("rooms/create/",            CreateRoomView.as_view()),
    path("rooms/join/<str:code>/",   JoinRoomView.as_view()),
    path("rooms/<str:code>/close/",  CloseRoomView.as_view()),  # ← moved UP
    path("rooms/<str:code>/",        RoomDetailView.as_view()), # ← moved DOWN
]