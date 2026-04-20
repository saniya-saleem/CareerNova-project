from django.urls import re_path, path
from .consumers import ChatConsumer, CallConsumer, NotificationConsumer  

websocket_urlpatterns = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
    re_path(r"ws/call/(?P<room_code>[\w-]+)/$", CallConsumer.as_asgi()), 
    re_path(r"ws/notify/$",NotificationConsumer.as_asgi()),
]