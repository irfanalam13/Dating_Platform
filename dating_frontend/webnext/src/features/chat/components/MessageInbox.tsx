// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { ChevronLeft, MessageCircle, ShieldCheck } from "lucide-react";
// import { getConversations } from "@/shared/api/chat.api";

// export function MessageInbox() {
//   const router = useRouter();
//   const { data = [], isLoading } = useQuery({
//     queryKey: ["conversations"],
//     queryFn: getConversations,
//     retry: false,
//   });

//   return (
//     <main className="min-h-[100dvh] bg-[#FFF8F1] text-[#2D2424]">
//       <div className="mx-auto max-w-md px-4 py-5">
//         <header className="mb-5 flex items-center gap-3">
//           <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
//             <ChevronLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-semibold">Conversations</h1>
//             <p className="text-sm text-[#746767]">Only mutual matches can message you.</p>
//           </div>
//         </header>

//         <div className="mb-5 flex items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4">
//           <ShieldCheck className="h-5 w-5 text-[#3F7D63]" />
//           <p className="text-sm text-[#746767]">Report and block controls are available in every chat.</p>
//         </div>

//         {isLoading && <div className="rounded-lg border border-[#EADDD2] bg-white p-5 text-sm text-[#746767]">Loading conversations...</div>}

//         {!isLoading && data.length === 0 && (
//           <div className="grid min-h-[420px] place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
//             <div>
//               <MessageCircle className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
//               <h2 className="font-semibold">No conversations yet</h2>
//               <p className="mt-2 text-sm leading-6 text-[#746767]">When both people show interest, conversation will open here.</p>
//             </div>
//           </div>
//         )}

//         <div className="space-y-3">
//           {data.map((conversation) => {
//             const person = conversation.participants[0];
//             return (
//               <button
//                 key={conversation.id}
//                 onClick={() => router.push(`/chat/${conversation.id}`)}
//                 className="flex w-full items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4 text-left"
//               >
//                 <img src={person?.profile_image || "/default.png"} alt={person?.name || "Match"} className="h-12 w-12 rounded-full object-cover" />
//                 <div className="min-w-0 flex-1">
//                   <p className="font-semibold">{person?.name || "Matched user"}</p>
//                   <p className="truncate text-sm text-[#746767]">{conversation.last_message || "Start a thoughtful conversation"}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }



"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { getConversations } from "@/shared/api/chat.api";
// import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuth } from "@/app/providers";

import type { ConversationParticipant } from "@/shared/types/chat.types";

export function MessageInbox() {
  const router = useRouter();
  const { user } = useAuth();

  const { data = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
    enabled: !!user, // ✅ don't fetch until user is loaded
    select: (conversations) =>
      // ✅ sort by most recently updated
      [...conversations].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
  });

  // ✅ Get the OTHER person, not the logged-in user
  const getOtherParticipant = (
    participants: ConversationParticipant[]
  ): ConversationParticipant | undefined => {
    return participants.find((p) => p.id !== user?.id);
  };

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] text-[#2D2424]">
      <div className="mx-auto max-w-md px-4 py-5">
        <header className="mb-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Conversations</h1>
            <p className="text-sm text-[#746767]">
              Only mutual matches can message you.
            </p>
          </div>
        </header>

        <div className="mb-5 flex items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4">
          <ShieldCheck className="h-5 w-5 text-[#3F7D63]" />
          <p className="text-sm text-[#746767]">
            Report and block controls are available in every chat.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4"
              >
                <div className="h-12 w-12 rounded-full bg-[#EADDD2]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-[#EADDD2]" />
                  <div className="h-3 w-2/3 rounded bg-[#EADDD2]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-[#EADDD2] bg-white p-8 text-center">
            <div>
              <MessageCircle className="mx-auto mb-4 h-10 w-10 text-[#7A2432]" />
              <h2 className="font-semibold">No conversations yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#746767]">
                When both people show interest, a conversation will open here.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {data.map((conversation) => {
            const person = getOtherParticipant(conversation.participants);

            // ✅ skip rendering if we can't identify the other person
            if (!person) return null;

            return (
              <button
                key={conversation.id}
                onClick={() => router.push(`/chat/${conversation.id}`)}
                className="flex w-full items-center gap-3 rounded-lg border border-[#EADDD2] bg-white p-4 text-left transition-colors hover:bg-[#FFF8F1]"
              >
                <div className="relative">
                  <img
                    src={person.profile_image || "/default.png"}
                    alt={person.name || "Match"}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{person.name || "Matched user"}</p>
                  <p className="truncate text-sm text-[#746767]">
                    {conversation.last_message || "Start a thoughtful conversation"}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[#746767]">
                  {new Date(conversation.updated_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}