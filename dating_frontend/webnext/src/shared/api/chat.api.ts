import type {
  Conversation,
  Message,
  SendMessageRequest,
  SendMessageResponse,
  StartConversationResponse,
} from "../types/chat.types";
import api from "./client";

export const startConversation = async (
  profileId: number
): Promise<StartConversationResponse> => {
  const res = await api.post(`/chat/start/${profileId}/`, {});
  return res.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const res = await api.get("/chat/");
  return res.data;
};

export const getMessages = async (conversationId: number): Promise<Message[]> => {
  const res = await api.get(`/chat/${conversationId}/messages/`);
  return res.data;
};

export const sendMessage = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const res = await api.post("/chat/send/", data);
  return res.data;
};
