// "use client";

// import { useRouter } from "next/navigation";
// import { BadgeCheck, MapPin, PenLine, Settings } from "lucide-react";
// import { useMyProfile } from "@/features/profile/hooks/useProfile";

// export default function ProfileClient() {
//   const router = useRouter();
//   const { data, isLoading } = useMyProfile();

//   if (isLoading) {
//     return <div className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] text-sm text-[#746767]">Loading profile...</div>;
//   }

//   if (!data) {
//     return <div className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] text-sm text-[#746767]">Profile unavailable.</div>;
//   }

//   return (
//     <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-5 text-[#2D2424]">
//       <div className="mx-auto max-w-md">
//         <header className="mb-5 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">My profile</p>
//             <h1 className="text-2xl font-semibold">Trust profile</h1>
//           </div>
//           <button onClick={() => router.push("/settings")} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
//             <Settings className="h-5 w-5" />
//           </button>
//         </header>

//         <section className="overflow-hidden rounded-lg border border-[#EADDD2] bg-white shadow-sm">
//           <img src={data.profile_image_url || data.profile_image || "/default.png"} alt={data.full_name || "Profile"} className="h-72 w-full object-cover" />
//           <div className="space-y-4 p-5">
//             <div>
//               <div className="flex items-center gap-2">
//                 <h2 className="text-2xl font-semibold">{data.full_name || "Complete your name"}</h2>
//                 {data.verified && <BadgeCheck className="h-5 w-5 text-[#3F7D63]" />}
//               </div>
//               <p className="mt-1 flex items-center gap-1 text-sm text-[#746767]">
//                 <MapPin className="h-4 w-4" />
//                 {data.age || "Age hidden"} · {data.city || "City not added"}
//               </p>
//             </div>
//             <p className="text-sm leading-6 text-[#746767]">{data.bio || "Add a short, respectful introduction."}</p>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <Info label="Intent" value={data.relationship_intent || "Not added"} />
//               <Info label="Career" value={data.career || "Not added"} />
//               <Info label="Education" value={data.education || "Not added"} />
//               <Info label="Privacy" value={data.is_profile_public ? "Public" : "Private"} />
//             </div>
//             <button onClick={() => router.push("/profile/edit")} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#7A2432] font-semibold text-white">
//               <PenLine className="h-4 w-4" />
//               Edit profile
//             </button>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// function Info({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-md border border-[#EADDD2] p-3">
//       <p className="text-[#746767]">{label}</p>
//       <p className="font-medium">{value}</p>
//     </div>
//   );
// }










"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  MapPin,
  PenLine,
  Settings,
  Eye,
  Lock,
  Heart,
  BookOpen,
  Briefcase,
  Star,
  Globe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import type { Profile } from "@/shared/types/profile.types";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-5">
      <div className="mx-auto max-w-md animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-[#EADDD2]" />
            <div className="h-6 w-36 rounded bg-[#EADDD2]" />
          </div>
          <div className="h-10 w-10 rounded-full bg-[#EADDD2]" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#EADDD2] bg-white">
          <div className="h-72 w-full bg-[#EADDD2]" />
          <div className="space-y-4 p-5">
            <div className="h-6 w-1/2 rounded bg-[#EADDD2]" />
            <div className="h-4 w-1/3 rounded bg-[#EADDD2]" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[#EADDD2]" />
              <div className="h-3 w-5/6 rounded bg-[#EADDD2]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[#EADDD2]" />
              ))}
            </div>
            <div className="h-12 w-full rounded-xl bg-[#EADDD2]" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Completion Bar ───────────────────────────────────────────────────────────
function completionScore(data: Profile): number {
  const fields: (keyof Profile)[] = [
    "full_name", "bio", "city", "age", "gender",
    "relationship_intent", "education", "career",
    "profile_image", "hobbies", "values",
  ];
  const filled = fields.filter((f) => {
    const val = data[f];
    return val !== null && val !== undefined && val !== "";
  }).length;
  return Math.round((filled / fields.length) * 100);
}

function CompletionBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "#3F7D63" : score >= 50 ? "#B78A3B" : "#7A2432";

  return (
    <div className="rounded-xl border border-[#EADDD2] bg-white p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#2D2424]">Profile strength</span>
        <span className="font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EADDD2]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      {score < 100 && (
        <p className="mt-2 text-xs text-[#746767]">
          {score < 50
            ? "Complete your profile to get more matches."
            : score < 80
            ? "Almost there — add a few more details."
            : "Great profile! Small touches can still help."}
        </p>
      )}
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const isEmpty = !value || value === "Not added";
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#EADDD2] bg-white p-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#FFF8F1]">
        <Icon className="h-4 w-4 text-[#7A2432]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#746767]">{label}</p>
        <p
          className={`truncate text-sm font-medium ${
            isEmpty ? "italic text-[#BFBFBF]" : "text-[#2D2424]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Tag Pill ─────────────────────────────────────────────────────────────────
function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#EADDD2] bg-white px-3 py-1 text-xs font-medium text-[#2D2424]">
      {label}
    </span>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#B78A3B]">
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileClient() {
  const router = useRouter();
  const { data, isLoading } = useMyProfile();

  if (isLoading) return <ProfileSkeleton />;

  if (!data) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] px-4 text-center">
        <div>
          <p className="text-lg font-semibold text-[#2D2424]">
            Profile unavailable
          </p>
          <p className="mt-1 text-sm text-[#746767]">
            Something went wrong loading your profile.
          </p>
          <button
            onClick={() => router.refresh()}
            className="mt-4 rounded-lg bg-[#7A2432] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const score = completionScore(data);
  const image = data.profile_image_url || data.profile_image || "/default.png";
  const hobbies = data.hobbies
    ? data.hobbies.split(",").map((h) => h.trim()).filter(Boolean)
    : [];
  const compatibilityTags = data.compatibility_tags ?? [];

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] pb-10 text-[#2D2424]">
      <div className="mx-auto max-w-md space-y-4 px-4 py-5">

        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B78A3B]">
              My profile
            </p>
            <h1 className="text-2xl font-semibold">Trust profile</h1>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white shadow-sm"
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        {/* ── Completion bar ── */}
        <CompletionBar score={score} />

        {/* ── Hero card ── */}
        <section className="overflow-hidden rounded-2xl border border-[#EADDD2] bg-white shadow-sm">
          {/* Image */}
          <div className="relative h-80 w-full">
            <img
              src={image}
              alt={data.full_name || "Profile"}
              className="h-full w-full object-cover"
              loading="eager"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Badges over image */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white drop-shadow">
                      {data.full_name || "Add your name"}
                    </h2>
                    {data.verified && (
                      <BadgeCheck className="h-5 w-5 text-[#3FC88A]" />
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {[data.age, data.city].filter(Boolean).join(" · ") ||
                      "Location not added"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      data.is_profile_public
                        ? "bg-[#3F7D63]/90 text-white"
                        : "bg-black/50 text-white"
                    }`}
                  >
                    {data.is_profile_public ? (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Private
                      </span>
                    )}
                  </span>
                  {data.verified && (
                    <span className="rounded-full bg-[#3FC88A]/90 px-2.5 py-1 text-xs font-semibold text-white">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="border-b border-[#EADDD2] p-5">
            <p className="text-sm leading-6 text-[#746767]">
              {data.bio || (
                <span className="italic text-[#BFBFBF]">
                  Add a short, respectful introduction about yourself.
                </span>
              )}
            </p>
          </div>

          {/* Edit button */}
          <div className="p-4">
            <button
              onClick={() => router.push("/profile/edit")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7A2432] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <PenLine className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </section>

        {/* ── About ── */}
        <Section title="About">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={Heart}
              label="Intent"
              value={data.relationship_intent || "Not added"}
            />
            <InfoCard
              icon={Briefcase}
              label="Career"
              value={data.career || "Not added"}
            />
            <InfoCard
              icon={BookOpen}
              label="Education"
              value={data.education || "Not added"}
            />
            <InfoCard
              icon={Globe}
              label="Ethnicity"
              value={data.ethnicity || "Not added"}
            />
          </div>
        </Section>

        {/* ── Values & Hobbies ── */}
        {(data.values || hobbies.length > 0) && (
          <Section title="Values & Hobbies">
            <div className="rounded-xl border border-[#EADDD2] bg-white p-4 space-y-3">
              {data.values && (
                <div>
                  <p className="mb-1.5 text-xs text-[#746767]">Values</p>
                  <p className="text-sm text-[#2D2424]">{data.values}</p>
                </div>
              )}
              {hobbies.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-[#746767]">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((h) => (
                      <TagPill key={h} label={h} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Compatibility Tags ── */}
        {compatibilityTags.length > 0 && (
          <Section title="Compatibility">
            <div className="rounded-xl border border-[#EADDD2] bg-white p-4">
              <div className="flex flex-wrap gap-2">
                {compatibilityTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-[#FFF0F2] px-3 py-1 text-xs font-medium text-[#7A2432]"
                  >
                    <Sparkles className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* ── Cultural ── */}
        {(data.religion_name || data.caste_name || data.gotra_name || data.gan || data.horoscope) && (
          <Section title="Cultural background">
            <div className="grid grid-cols-2 gap-3">
              {data.religion_name && (
                <InfoCard icon={Star} label="Religion" value={data.religion_name} />
              )}
              {data.caste_name && (
                <InfoCard icon={Star} label="Caste" value={data.caste_name} />
              )}
              {data.gotra_name && (
                <InfoCard icon={Star} label="Gotra" value={data.gotra_name} />
              )}
              {data.gan && (
                <InfoCard icon={Star} label="Gan" value={data.gan} />
              )}
              {data.horoscope && (
                <InfoCard icon={Star} label="Horoscope" value={data.horoscope} />
              )}
            </div>
          </Section>
        )}

        {/* ── Incomplete nudge ── */}
        {score < 80 && (
          <button
            onClick={() => router.push("/profile/edit")}
            className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#7A2432]/40 bg-[#FFF0F2] px-4 py-3"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-[#7A2432]">
                Complete your profile
              </p>
              <p className="text-xs text-[#746767]">
                More details = better matches
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-[#7A2432]" />
          </button>
        )}
      </div>
    </main>
  );
}