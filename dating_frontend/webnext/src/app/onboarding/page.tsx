"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartHandshake, Lock, ShieldCheck } from "lucide-react";
import { updateProfile } from "@/shared/api/profile.api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState("Serious Relationship");
  const [privacy, setPrivacy] = useState("true");
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    const data = new FormData();
    data.append("relationship_intent", intent);
    data.append("is_profile_public", privacy);
    await updateProfile(data);
    router.push("/profile/edit");
  };

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-6 text-[#2D2424]">
      <div className="mx-auto flex min-h-[calc(100dvh-48px)] max-w-md flex-col">
        <div className="mb-8 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className={`h-1.5 rounded-full ${item <= step ? "bg-[#7A2432]" : "bg-[#EADDD2]"}`} />
          ))}
        </div>

        <motion.section key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col justify-center">
          {step === 0 && (
            <div>
              <HeartHandshake className="mb-5 h-12 w-12 text-[#7A2432]" />
              <h1 className="text-3xl font-semibold leading-tight">Safe, respectful connections for Nepal</h1>
              <p className="mt-4 text-base leading-7 text-[#746767]">Meet people who are looking for meaning, shared values, and long-term commitment.</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <ShieldCheck className="h-10 w-10 text-[#7A2432]" />
              <h1 className="text-2xl font-semibold">Choose your intention</h1>
              {["Serious Relationship", "Marriage"].map((item) => (
                <button key={item} onClick={() => setIntent(item)} className={`h-16 w-full rounded-lg border px-4 text-left font-semibold ${intent === item ? "border-[#7A2432] bg-[#F8EFE6] text-[#7A2432]" : "border-[#EADDD2] bg-white"}`}>
                  {item}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Lock className="h-10 w-10 text-[#7A2432]" />
              <h1 className="text-2xl font-semibold">Set your comfort level</h1>
              <p className="text-sm leading-6 text-[#746767]">You can keep your profile private while you complete setup. Messaging opens only after mutual match.</p>
              {[
                ["true", "Public profile"],
                ["false", "Private profile"],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setPrivacy(value)} className={`h-14 w-full rounded-lg border px-4 text-left font-semibold ${privacy === value ? "border-[#7A2432] bg-[#F8EFE6] text-[#7A2432]" : "border-[#EADDD2] bg-white"}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </motion.section>

        <div className="grid grid-cols-2 gap-3">
          <button disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="h-12 rounded-md border border-[#EADDD2] bg-white font-semibold disabled:opacity-40">
            Back
          </button>
          {step < 2 ? (
            <button onClick={() => setStep((value) => value + 1)} className="h-12 rounded-md bg-[#7A2432] font-semibold text-white">
              Continue
            </button>
          ) : (
            <button onClick={finish} disabled={saving} className="h-12 rounded-md bg-[#7A2432] font-semibold text-white disabled:opacity-60">
              {saving ? "Saving..." : "Start setup"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
