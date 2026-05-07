"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Bell, ChevronLeft, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import { getNotifications, markNotificationRead, type AppNotification } from "@/shared/api/notification.api";

function NotificationIcon({ type }: { type: AppNotification["notification_type"] }) {
  if (type === "match") return <HeartHandshake className="h-5 w-5" />;
  if (type === "message") return <MessageCircle className="h-5 w-5" />;
  return <ShieldCheck className="h-5 w-5" />;
}

export default function Notifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    retry: false,
  });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const openNotification = (item: AppNotification) => {
    if (!item.is_read) readMutation.mutate(item.id);
    if (item.conversation_id) router.push(`/chat/${item.conversation_id}`);
    else if (item.profile_id) router.push("/matches");
  };

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 pb-24 pt-5 text-[#2D2424]">
      <div className="mx-auto max-w-md">
        <header className="mb-5 flex items-center gap-3">
          <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-[#746767]">Matches, messages, and safety updates.</p>
          </div>
        </header>

        {isLoading && <div className="rounded-lg border border-[#EADDD2] bg-white p-5 text-sm text-[#746767]">Loading notifications...</div>}

        {!isLoading && data.length === 0 && (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
            <div>
              <Bell className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
              <h2 className="font-semibold">No notifications yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#746767]">Important match, message, and safety updates will appear here.</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => openNotification(item)}
              className="flex w-full items-start gap-3 rounded-lg border border-[#EADDD2] bg-white p-4 text-left"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.is_read ? "bg-[#F8EFE6] text-[#746767]" : "bg-[#7A2432] text-white"}`}>
                <NotificationIcon type={item.notification_type} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-[#746767]">{item.body || "Tap to view details."}</span>
              </span>
              {!item.is_read && <span className="mt-2 h-2 w-2 rounded-full bg-[#B78A3B]" />}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
