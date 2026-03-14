from django.urls import path
from .views import ProfileView, ActivityListView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/activities/", ActivityListView.as_view(), name="activities"),
]