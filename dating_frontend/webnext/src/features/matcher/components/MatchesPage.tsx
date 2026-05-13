"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HeartHandshake, MessageCircle, UserCheck, X } from "lucide-react";
import {
  acceptMatch,
  getAcceptedMatches,
  getReceivedMatches,
  rejectMatch,
} from "@/shared/api/matcher.api";
import { startConversation } from "@/shared/api/chat.api";
// import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuth } from "@/app/providers";

export default function MatchesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["acceptedMatches"],
    queryFn: getAcceptedMatches,
    enabled: !!user, // ✅ wait for auth
    retry: false,
  });

  const { data: received = [], isLoading: receivedLoading } = useQuery({
    queryKey: ["receivedMatches"],
    queryFn: getReceivedMatches,
    enabled: !!user, // ✅ wait for auth
    retry: false,
  });

  const isLoading = matchesLoading || receivedLoading;

  const acceptMutation = useMutation({
    mutationFn: acceptMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acceptedMatches"] });
      queryClient.invalidateQueries({ queryKey: ["receivedMatches"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectMatch,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["receivedMatches"] }),
  });

  const conversationMutation = useMutation({
    mutationFn: startConversation,
    onSuccess: (res) => router.push(`/chat/${res.conversation_id}`),
  });

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 pb-24 pt-5 text-[#2D2424]">
      <div className="mx-auto max-w-md">
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">
            Matches
          </p>
          <h1 className="text-2xl font-semibold">People who chose you too</h1>
          <p className="mt-1 text-sm text-[#746767]">
            Conversation opens only after mutual interest.
          </p>
        </header>

        {/* ── Pending interests ── */}
        {received.length > 0 && (
          <section className="mb-5 rounded-lg border border-[#EADDD2] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#7A2432]" />
              <h2 className="font-semibold">Pending interests</h2>
            </div>
            <div className="space-y-3">
              {received.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md bg-[#F8EFE6] p-3"
                >
                  <div>
                    {/* ⚠️ sender may be email/id — update after seeing console.log */}
                    <p className="text-sm font-semibold">
                      {item.sender || "Someone"}
                    </p>
                    <p className="text-xs text-[#746767]">
                      is interested in your profile
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => rejectMutation.mutate(item.id)}
                      disabled={rejectMutation.isPending}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#746767] disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => acceptMutation.mutate(item.id)}
                      disabled={acceptMutation.isPending}
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#7A2432] text-white disabled:opacity-50"
                    >
                      <HeartHandshake className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skeleton loader ── */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4"
              >
                <div className="h-14 w-14 rounded-full bg-[#EADDD2]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-[#EADDD2]" />
                  <div className="h-3 w-1/4 rounded bg-[#EADDD2]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && matches.length === 0 && (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
            <div>
              <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
              <h2 className="font-semibold">No mutual matches yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#746767]">
                Show interest from Discover. When both people agree, they appear
                here.
              </p>
              <button
                onClick={() => router.push("/home")}
                className="mt-5 h-11 rounded-md bg-[#7A2432] px-5 text-sm font-semibold text-white"
              >
                Go to Discover
              </button>
            </div>
          </div>
        )}

        {/* ── Accepted matches list ── */}
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4"
            >
              <img
                src={match.profile_image || "/default.png"}
                alt={match.name || "Match"}
                className="h-14 w-14 rounded-full object-cover"
                loading="eager"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{match.name || match.email}</p>
                <p className="text-sm text-[#746767]">Mutual match</p>
              </div>
              {match.profile_id && (
                <button
                  onClick={() =>
                    conversationMutation.mutate(match.profile_id!)
                  }
                  disabled={conversationMutation.isPending}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#7A2432] text-white disabled:opacity-50"
                >
                  {conversationMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}