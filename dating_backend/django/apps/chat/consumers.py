import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from django.utils import timezone

from .models import Message, Conversation
from apps.notification.services import send_notification
from apps.safety.services.safety_engine import analyze_message


class ChatConsumer(AsyncWebsocketConsumer):

    # =====================================================
    # 🔌 CONNECT
    # =====================================================
    async def connect(self):
        self.user = self.scope["user"]

        if isinstance(self.user, AnonymousUser):
            await self.close()
            return

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        # 🔐 Access check
        if not await self.user_in_conversation():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # 🟢 Set online
        await self.set_user_online(True)

    # =====================================================
    # ❌ DISCONNECT
    # =====================================================
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # 🔴 Set offline
        await self.set_user_online(False)

    # =====================================================
    # 📩 RECEIVE
    # =====================================================
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            msg_type = data.get("type", "message")

            # =========================
            # 💬 MESSAGE
            # =========================
            if msg_type == "message":
                message_text = data.get("message")

                if not message_text:
                    return

                # 💾 Save
                msg = await self.create_message(message_text)

                # 🤖 AI safety
                await sync_to_async(analyze_message)(self.user, message_text)

                # 🔔 Notify
                receiver = await self.get_receiver()
                await self.send_notification_async(receiver, message_text)

                # 📡 Broadcast
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": msg.content,
                        "sender": self.user.email,
                        "message_id": msg.id,
                    }
                )

            # =========================
            # ✍️ TYPING
            # =========================
            elif msg_type == "typing":
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "typing_event",
                        "user": self.user.email,
                        "is_typing": data.get("is_typing", False)
                    }
                )

            # =========================
            # 👁️ READ RECEIPT
            # =========================
            elif msg_type == "read":
                await self.mark_messages_read()

        except Exception as e:
            await self.send(text_data=json.dumps({
                "error": str(e)
            }))

    # =====================================================
    # 📡 HANDLERS
    # =====================================================

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"],
            "sender": event["sender"],
            "message_id": event["message_id"],
        }))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing",
            "user": event["user"],
            "is_typing": event["is_typing"]
        }))

    # =====================================================
    # 🔧 DB HELPERS
    # =====================================================

    @sync_to_async
    def user_in_conversation(self):
        return Conversation.objects.filter(
            id=self.conversation_id,
            participants=self.user
        ).exists()

    @sync_to_async
    def create_message(self, message_text):
        return Message.objects.create(
            conversation_id=self.conversation_id,
            sender=self.user,
            content=message_text
        )

    @sync_to_async
    def get_receiver(self):
        convo = Conversation.objects.get(id=self.conversation_id)
        return convo.participants.exclude(id=self.user.id).first()

    @sync_to_async
    def mark_messages_read(self):
        Message.objects.filter(
            conversation_id=self.conversation_id,
            is_read=False
        ).exclude(sender=self.user).update(
            is_read=True,
            read_at=timezone.now()
        )

    @sync_to_async
    def set_user_online(self, status):
        self.user.is_online = status
        self.user.save(update_fields=["is_online"])

    @sync_to_async
    def send_notification_async(self, receiver, message):
        if receiver:
            send_notification(
                user=receiver,
                data={
                    "type": "message",
                    "title": "New Message 💬",
                    "body": message,
                    "conversation_id": self.conversation_id,
                }
            )

            