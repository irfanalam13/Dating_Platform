"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck, MapPin, PenLine, Settings } from "lucide-react";
import { useMyProfile } from "@/features/profile/hooks/useProfile";

export default function ProfileClient() {
  const router = useRouter();
  const { data, isLoading } = useMyProfile();

  if (isLoading) {
    return <div className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] text-sm text-[#746767]">Loading profile...</div>;
  }

  if (!data) {
    return <div className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] text-sm text-[#746767]">Profile unavailable.</div>;
  }

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-5 text-[#2D2424]">
      <div className="mx-auto max-w-md">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">My profile</p>
            <h1 className="text-2xl font-semibold">Trust profile</h1>
          </div>
          <button onClick={() => router.push("/settings")} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
            <Settings className="h-5 w-5" />
          </button>
        </header>

        <section className="overflow-hidden rounded-lg border border-[#EADDD2] bg-white shadow-sm">
          <img src={data.profile_image_url || data.profile_image || "/default.png"} alt={data.full_name || "Profile"} className="h-72 w-full object-cover" />
          <div className="space-y-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{data.full_name || "Complete your name"}</h2>
                {data.verified && <BadgeCheck className="h-5 w-5 text-[#3F7D63]" />}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-[#746767]">
                <MapPin className="h-4 w-4" />
                {data.age || "Age hidden"} · {data.city || "City not added"}
              </p>
            </div>
            <p className="text-sm leading-6 text-[#746767]">{data.bio || "Add a short, respectful introduction."}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Intent" value={data.relationship_intent || "Not added"} />
              <Info label="Career" value={data.career || "Not added"} />
              <Info label="Education" value={data.education || "Not added"} />
              <Info label="Privacy" value={data.is_profile_public ? "Public" : "Private"} />
            </div>
            <button onClick={() => router.push("/profile/edit")} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#7A2432] font-semibold text-white">
              <PenLine className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#EADDD2] p-3">
      <p className="text-[#746767]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
