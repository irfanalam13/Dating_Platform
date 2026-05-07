"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Ban, ChevronLeft, Flag, Send } from "lucide-react";
import { getConversations, getMessages, sendMessage } from "@/shared/api/chat.api";
import { blockProfile, reportProfile } from "@/shared/api/mvp.api";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams<{ conversationId: string }>();
  const conversationId = Number(params.conversationId);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [showReport, setShowReport] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: Number.isFinite(conversationId),
    retry: false,
  });
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });
  const conversation = conversations.find((item) => item.id === conversationId);
  const participant = conversation?.participants[0];

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const blockMutation = useMutation({
    mutationFn: blockProfile,
    onSuccess: () => router.push("/chat"),
  });
  const reportMutation = useMutation({
    mutationFn: (profileId: number) => reportProfile(profileId, { reason: "other", description: "Reported from chat safety controls." }),
    onSuccess: () => setShowReport(false),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ conversation_id: conversationId, content: content.trim() });
  };

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#FFF8F1] text-[#2D2424]">
      <header className="mx-auto flex w-full max-w-md items-center gap-2 border-b border-[#EADDD2] bg-white px-4 py-3">
        <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold">Matched conversation</h1>
          <p className="text-xs text-[#746767]">Mutual match only</p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          disabled={!participant?.profile_id}
          className="grid h-9 w-9 place-items-center rounded-full text-[#746767] disabled:opacity-40"
        >
          <Flag className="h-4 w-4" />
        </button>
        <button
          onClick={() => participant?.profile_id && blockMutation.mutate(participant.profile_id)}
          disabled={!participant?.profile_id || blockMutation.isPending}
          className="grid h-9 w-9 place-items-center rounded-full text-[#746767] disabled:opacity-40"
        >
          <Ban className="h-4 w-4" />
        </button>
      </header>

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        {isLoading && <p className="text-sm text-[#746767]">Loading messages...</p>}
        {!isLoading && data.length === 0 && (
          <div className="mt-20 rounded-lg border border-[#EADDD2] bg-white p-5 text-center text-sm leading-6 text-[#746767]">
            Start with respect and curiosity. Share only what you are comfortable sharing.
          </div>
        )}
        {data.map((message) => (
          <div key={message.id} className="max-w-[82%] rounded-lg border border-[#EADDD2] bg-white p-3 text-sm leading-6 shadow-sm">
            {message.content}
          </div>
        ))}
      </section>

      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-md gap-2 border-t border-[#EADDD2] bg-white p-3">
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a respectful message"
          className="h-12 min-w-0 flex-1 rounded-md border border-[#EADDD2] px-3 text-sm outline-none focus:border-[#7A2432]"
        />
        <button disabled={mutation.isPending} className="grid h-12 w-12 place-items-center rounded-md bg-[#7A2432] text-white disabled:opacity-60">
          <Send className="h-5 w-5" />
        </button>
      </form>

      {showReport && participant?.profile_id && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#2D2424]/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 text-center">
            <Flag className="mx-auto mb-3 h-8 w-8 text-[#7A2432]" />
            <h2 className="text-lg font-semibold">Report this conversation?</h2>
            <p className="mt-2 text-sm leading-6 text-[#746767]">Your report goes to the safety team. The other person will not be notified.</p>
            <button
              onClick={() => reportMutation.mutate(participant.profile_id!)}
              disabled={reportMutation.isPending}
              className="mt-5 h-11 w-full rounded-md bg-[#7A2432] text-sm font-semibold text-white disabled:opacity-60"
            >
              Submit report
            </button>
            <button onClick={() => setShowReport(false)} className="mt-3 text-sm font-semibold text-[#746767]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
