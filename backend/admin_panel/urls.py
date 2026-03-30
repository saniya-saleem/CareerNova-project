from django.urls import path
from .views import (
    AdminStatsView,
    AdminUsersView,
    AdminBanUserView,
    AdminActivityView,
    AdminInterviewsView,
    AdminCheckView,
)

urlpatterns = [
    path("stats/", AdminStatsView.as_view()),
    path("users/", AdminUsersView.as_view()),
    path("users/<int:user_id>/delete/", AdminUsersView.as_view()),
    path("users/<int:user_id>/ban/", AdminBanUserView.as_view()),
    path("activity/", AdminActivityView.as_view()),
    path("interviews/", AdminInterviewsView.as_view()),
    path("check/", AdminCheckView.as_view()),
]