from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("candidate", "Candidate"),
        ("admin", "Admin"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="candidate")
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username
    

