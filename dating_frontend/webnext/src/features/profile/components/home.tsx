"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BadgeCheck, Eye, HeartHandshake, MapPin, SlidersHorizontal, X } from "lucide-react";
import { getDiscoverProfiles, sendInterest } from "@/shared/api/profile.api";
import { startConversation } from "@/shared/api/chat.api";
import type { Profile } from "@/shared/types/profile.types";
import { useRouter } from "next/navigation";

function displayImage(profile: Profile) {
  return profile.profile_image_url || profile.profile_image || "/default.png";
}

export default function HomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["discoverProfiles"],
    queryFn: getDiscoverProfiles,
    retry: false,
  });

  const profiles = useMemo(() => data?.results ?? [], [data]);
  const current = profiles[0];

  const interestMutation = useMutation({
    mutationFn: ({ profileId, action }: { profileId: number; action: "like" | "pass" }) =>
      sendInterest(profileId, action),
    onSuccess: (res) => {
      if (res.matched && current) {
        setMatchProfile(current);
      }
      queryClient.invalidateQueries({ queryKey: ["discoverProfiles"] });
    },
  });

  const conversationMutation = useMutation({
    mutationFn: startConversation,
    onSuccess: (res) => router.push(`/chat/${res.conversation_id}`),
  });

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] text-[#2D2424]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 pb-24 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">Discover</p>
            <h1 className="text-2xl font-semibold">Meaningful matches</h1>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white text-[#7A2432]">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </header>

        {isLoading && (
          <div className="grid flex-1 place-items-center rounded-lg border border-[#EADDD2] bg-white p-6 text-sm text-[#746767]">
            Finding respectful matches...
          </div>
        )}

        {!isLoading && !current && (
          <div className="grid flex-1 place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
            <div>
              <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
              <h2 className="text-lg font-semibold">No new profiles right now</h2>
              <p className="mt-2 text-sm text-[#746767]">Update preferences or check back later for new compatible profiles.</p>
            </div>
          </div>
        )}

        {current && (
          <motion.section
            key={current.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#EADDD2] bg-white shadow-sm"
          >
            <div className="relative h-[430px] bg-[#F8EFE6]">
              <Image src={displayImage(current)} alt={current.full_name || "Profile"} fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D2424]/85 to-transparent p-5 pt-24 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-2xl font-semibold">{current.full_name || "Profile"}</h2>
                  {current.verified && <BadgeCheck className="h-5 w-5 text-[#B78A3B]" />}
                </div>
                <p className="flex items-center gap-1 text-sm text-white/85">
                  <MapPin className="h-4 w-4" />
                  {current.age || "Age hidden"} · {current.city || "Nepal"} · {current.career || "Career not added"}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-sm leading-6 text-[#746767]">
                  {current.bio || "Looking for a respectful connection built on shared values and trust."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(current.compatibility_tags ?? ["Meaningful profile"]).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#F8EFE6] px-3 py-1 text-xs font-medium text-[#7A2432]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-[#EADDD2] p-3">
                  <p className="text-[#746767]">Education</p>
                  <p className="font-medium">{current.education || "Not added"}</p>
                </div>
                <div className="rounded-md border border-[#EADDD2] p-3">
                  <p className="text-[#746767]">Intent</p>
                  <p className="font-medium">{current.relationship_intent || "Meaningful"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <button
                  onClick={() => interestMutation.mutate({ profileId: current.id, action: "pass" })}
                  className="flex h-12 items-center justify-center rounded-md border border-[#EADDD2] bg-white text-[#746767]"
                >
                  <X className="h-5 w-5" />
                </button>
                <button onClick={() => setViewProfile(current)} className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#EADDD2] bg-[#F8EFE6] text-sm font-semibold text-[#7A2432]">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => interestMutation.mutate({ profileId: current.id, action: "like" })}
                  className="flex h-12 items-center justify-center rounded-md bg-[#7A2432] text-white"
                >
                  <HeartHandshake className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {matchProfile && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#2D2424]/50 px-4">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-lg bg-white p-6 text-center">
            <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-[#7A2432]" />
            <h2 className="text-xl font-semibold">You both are interested</h2>
            <p className="mt-2 text-sm text-[#746767]">Start with a thoughtful conversation when you are ready.</p>
            <button
              onClick={() => conversationMutation.mutate(matchProfile.id)}
              className="mt-5 h-12 w-full rounded-md bg-[#7A2432] text-sm font-semibold text-white"
            >
              Start Conversation
            </button>
            <button onClick={() => setMatchProfile(null)} className="mt-3 text-sm font-medium text-[#746767]">
              Continue discovering
            </button>
          </motion.div>
        </div>
      )}

      {viewProfile && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#2D2424]/50 px-4 sm:place-items-center">
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4 max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{viewProfile.full_name || "Profile"}</h2>
                <p className="text-sm text-[#746767]">{viewProfile.age || "Age hidden"} · {viewProfile.city || "Nepal"}</p>
              </div>
              <button onClick={() => setViewProfile(null)} className="grid h-9 w-9 place-items-center rounded-full border border-[#EADDD2]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <Detail label="Intent" value={viewProfile.relationship_intent} />
              <Detail label="Education" value={viewProfile.education} />
              <Detail label="Career" value={viewProfile.career} />
              <Detail label="Values" value={viewProfile.values} />
              <Detail label="Interests" value={viewProfile.hobbies} />
              <Detail label="Ethnicity" value={viewProfile.ethnicity} />
              <Detail label="Religion" value={viewProfile.religion_name || ""} />
              <Detail label="Caste" value={viewProfile.caste_name || ""} />
              <Detail label="Gotra" value={viewProfile.gotra_name || ""} />
              <Detail label="Horoscope" value={viewProfile.horoscope} />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-[#EADDD2] p-3">
      <p className="text-[#746767]">{label}</p>
      <p className="mt-1 font-medium text-[#2D2424]">{value || "Not added"}</p>
    </div>
  );
}
