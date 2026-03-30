from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    participant_count = serializers.SerializerMethodField()

    class Meta:
        model  = Room
        fields = ["id", "code", "created_by", "created_at", "is_active","participant_count"]
        read_only_fields = ["id", "code", "created_by", "created_at"]
        
    def get_participant_count(self, obj):
        return obj.participants.count()
    
from rest_framework import serializers
from .models import Room, AIMessage, RoomMessage

class RoomSerializer(serializers.ModelSerializer):
    created_by        = serializers.StringRelatedField()
    participant_count = serializers.SerializerMethodField()

    class Meta:
        model  = Room
        fields = ["id", "code", "created_by", "participant_count", "created_at", "is_active"]

    def get_participant_count(self, obj):
        return obj.participants.count()


class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AIMessage
        fields = ["id", "role", "content", "created_at"]


class RoomMessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()

    class Meta:
        model  = RoomMessage
        fields = ["id", "sender", "content", "created_at"]    