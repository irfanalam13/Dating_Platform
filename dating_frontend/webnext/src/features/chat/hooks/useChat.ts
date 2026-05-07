"use client";

import { useState, useEffect, useCallback } from "react";
// Adjust this import path to wherever your types.ts file actually lives
import type { Message, SendMessageRequest, SendMessageResponse } from "@/shared/types/chat.types";

interface UseChatProps {
  conversationId: number | null; 
  currentUserId: number; // Matches the 'sender' type in your Message interface
  currentUserEmail?: string; 
}

export const useChat = ({ conversationId, currentUserId, currentUserEmail }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  // 1. Fetch initial message history
  useEffect(() => {
    // Don't fetch if there's no active conversation
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 🚧 ADJUST API PATH: Change this to match your actual backend URL
        const response = await fetch(`/api/messages?conversation_id=${conversationId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data: Message[] = await response.json();
        setMessages(data);
      } catch (err: any) {
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 💡 If you add WebSockets later (e.g., Pusher/Socket.io), 
    // subscribe to new incoming messages right here.

  }, [conversationId]);

  // 2. Send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversationId) return;

      setIsSending(true);
      setError(null);

      // Create a temporary "Optimistic" message so the UI feels instant
      const tempId = Date.now(); // Temporary fake ID
      const optimisticMessage: Message = {
        id: tempId,
        conversation: conversationId,
        sender: currentUserId,
        sender_email: currentUserEmail,
        content: content.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Immediately show the message in the chat
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        const payload: SendMessageRequest = {
          conversation_id: conversationId,
          content: optimisticMessage.content,
        };

        // 🚧 ADJUST API PATH: Change this to match your actual backend URL
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data: SendMessageResponse = await response.json();

        // Swap out the temporary fake ID for the real ID returned from the database
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === tempId ? { ...msg, id: data.id } : msg
          )
        );

      } catch (err: any) {
        // If the request fails, remove the optimistic message from the screen
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setError("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, currentUserId, currentUserEmail]
  );

  return {
    messages,
    loading,
    error,
    isSending,
    sendMessage,
  };
};