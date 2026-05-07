import api from "./client";

export interface AppNotification {
  id: number;
  notification_type: "match" | "message" | "system";
  title: string;
  body: string;
  conversation_id: number | null;
  profile_id: number | null;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (): Promise<AppNotification[]> => {
  const res = await api.get("/notification/");
  return res.data;
};

export const markNotificationRead = async (id: number): Promise<{ message: string }> => {
  const res = await api.post(`/notification/${id}/read/`);
  return res.data;
};
