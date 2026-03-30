from django.db import models
from django.conf import settings
import secrets


class Room(models.Model):
    code = models.CharField(max_length=10, unique=True, db_index=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_rooms"
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="joined_rooms",
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Room {self.code} by {self.created_by.username}"

    @staticmethod
    def generate_code():
        while True:
            code = secrets.token_urlsafe(6).upper()[:8]
            if not Room.objects.filter(code=code).exists():
                return code


# ── AI Chat history ─────────────────────────────
class AIMessage(models.Model):
    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant")
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_messages"
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user.username} [{self.role}] — {self.content[:40]}"


# ── Room Chat history ───────────────────────────
class RoomMessage(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="room_messages"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.username} in {self.room.code} — {self.content[:40]}"