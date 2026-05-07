from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from apps.chat.models import Conversation, Message
from apps.chat.serializers import MessageSerializer
from apps.matcher.models import Match
from apps.profiles.models.profile import Profile
from apps.safety.services.safety_engine import analyze_message


# =====================================================
# 💬 START CONVERSATION
# =====================================================
class StartConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, profile_id):
        user = request.user
        target_profile = get_object_or_404(Profile, id=profile_id)
        target_user = target_profile.user

        if target_user == user:
            return Response({"error": "Cannot start conversation with yourself"}, status=400)

        is_matched = Match.objects.filter(
            status="accepted",
            user1__in=[user, target_user],
            user2__in=[user, target_user],
        ).exists()

        if not is_matched:
            return Response(
                {"error": "Conversation is available only after a mutual match"},
                status=status.HTTP_403_FORBIDDEN,
            )

        convo = Conversation.objects.filter(
            participants=user
        ).filter(
            participants=target_user
        ).first()

        if not convo:
            convo = Conversation.objects.create()
            convo.participants.add(user, target_user)

        return Response({"conversation_id": convo.id}, status=201)


# =====================================================
# 📋 LIST CONVERSATIONS
# =====================================================
class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        convos = Conversation.objects.filter(participants=request.user).prefetch_related("participants")

        data = []
        for c in convos:
            last_message = c.messages.order_by("-created_at").first()
            data.append({
                "id": c.id,
                "participants": [
                    {
                        "id": u.id,
                        "email": u.email,
                        "name": getattr(getattr(u, "profile", None), "full_name", None) or u.full_name or u.email,
                        "profile_id": getattr(getattr(u, "profile", None), "id", None),
                        "profile_image": getattr(getattr(u, "profile", None), "profile_image", None).url
                        if getattr(getattr(u, "profile", None), "profile_image", None)
                        else None,
                    }
                    for u in c.participants.all()
                    if u != request.user
                ],
                "last_message": last_message.content if last_message else "",
                "updated_at": last_message.created_at if last_message else c.created_at,
            })

        return Response(data)


# =====================================================
# 📨 GET MESSAGES
# =====================================================
class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        convo = get_object_or_404(Conversation, id=conversation_id)

        # 🔐 Access control
        if request.user not in convo.participants.all():
            return Response({"error": "Access denied"}, status=403)

        messages = Message.objects.filter(conversation=convo).order_by("created_at")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


# =====================================================
# ✉️ SEND MESSAGE
# =====================================================
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        convo_id = request.data.get("conversation_id")
        content = request.data.get("content")

        if not content:
            return Response({"error": "Message cannot be empty"}, status=400)

        convo = get_object_or_404(Conversation, id=convo_id)

        # 🔐 Access control
        if request.user not in convo.participants.all():
            return Response({"error": "Access denied"}, status=403)

        message = Message.objects.create(
            conversation=convo,
            sender=request.user,
            content=content
        )

        # 🤖 AI safety check
        analyze_message(request.user, content)

        return Response({
            "message": "sent",
            "id": message.id
        }, status=201)
    

    
