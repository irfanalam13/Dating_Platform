"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { getConversations } from "@/shared/api/chat.api";

export function MessageInbox() {
  const router = useRouter();
  const { data = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] text-[#2D2424]">
      <div className="mx-auto max-w-md px-4 py-5">
        <header className="mb-5 flex items-center gap-3">
          <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Conversations</h1>
            <p className="text-sm text-[#746767]">Only mutual matches can message you.</p>
          </div>
        </header>

        <div className="mb-5 flex items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4">
          <ShieldCheck className="h-5 w-5 text-[#3F7D63]" />
          <p className="text-sm text-[#746767]">Report and block controls are available in every chat.</p>
        </div>

        {isLoading && <div className="rounded-lg border border-[#EADDD2] bg-white p-5 text-sm text-[#746767]">Loading conversations...</div>}

        {!isLoading && data.length === 0 && (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
            <div>
              <MessageCircle className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
              <h2 className="font-semibold">No conversations yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#746767]">When both people show interest, conversation will open here.</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {data.map((conversation) => {
            const person = conversation.participants[0];
            return (
              <button
                key={conversation.id}
                onClick={() => router.push(`/chat/${conversation.id}`)}
                className="flex w-full items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4 text-left"
              >
                <img src={person?.profile_image || "/default.png"} alt={person?.name || "Match"} className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{person?.name || "Matched user"}</p>
                  <p className="truncate text-sm text-[#746767]">{conversation.last_message || "Start a thoughtful conversation"}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
