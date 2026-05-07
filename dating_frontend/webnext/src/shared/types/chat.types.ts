export interface ConversationParticipant {
  id: number;
  email: string;
  name: string;
  profile_id: number | null;
  profile_image: string | null;
}

export interface Conversation {
  id: number;
  participants: ConversationParticipant[];
  last_message: string;
  updated_at: string;
  created_at?: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_email?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface StartConversationResponse {
  conversation_id: number;
}

export interface SendMessageRequest {
  conversation_id: number;
  content: string;
}

export interface SendMessageResponse {
  message: string;
  id: number;
}
