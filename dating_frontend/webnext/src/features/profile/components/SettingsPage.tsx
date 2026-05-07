"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Bell, ChevronLeft, GraduationCap, Lock, LogOut, ShieldCheck, SlidersHorizontal, UserRound, type LucideIcon } from "lucide-react";
import {
  getBlockedUsers,
  getPrivacySettings,
  getProfileSettings,
  unblockProfile,
  updatePrivacySettings,
  updateProfileSettings,
} from "@/shared/api/mvp.api";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useLogout();

  const { data: privacy } = useQuery({ queryKey: ["privacy"], queryFn: getPrivacySettings, retry: false });
  const { data: settings } = useQuery({ queryKey: ["profileSettings"], queryFn: getProfileSettings, retry: false });
  const { data: blocked = [] } = useQuery({ queryKey: ["blockedUsers"], queryFn: getBlockedUsers, retry: false });

  const privacyMutation = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["privacy"] }),
  });

  const settingsMutation = useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profileSettings"] }),
  });

  const unblockMutation = useMutation({
    mutationFn: unblockProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blockedUsers"] }),
  });

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F1] px-4 py-5 text-[#2D2424]">
      <div className="mx-auto max-w-md">
        <header className="mb-5 flex items-center gap-3">
          <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full border border-[#EADDD2] bg-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-[#746767]">Control privacy, preferences, and safety.</p>
          </div>
        </header>

        <section className="mb-4 rounded-lg border border-[#EADDD2] bg-white p-4">
          <SectionTitle icon={Lock} title="Account privacy" detail="MVP privacy works with your Django privacy app." />
          <Toggle
            label="Public profile"
            checked={privacy?.is_profile_public ?? true}
            onChange={(value) => privacyMutation.mutate({ is_profile_public: value, allow_messages_from: "matches" })}
          />
          <Toggle
            label="Show profile image"
            checked={privacy?.show_profile_image ?? true}
            onChange={(value) => privacyMutation.mutate({ show_profile_image: value })}
          />
          <Toggle
            label="Show location"
            checked={privacy?.show_location ?? true}
            onChange={(value) => privacyMutation.mutate({ show_location: value })}
          />
          <div className="mt-3 rounded-md bg-[#F8EFE6] p-3 text-sm text-[#746767]">
            Messages are locked to mutual matches for MVP safety.
          </div>
        </section>

        <section className="mb-4 rounded-lg border border-[#EADDD2] bg-white p-4">
          <SectionTitle icon={ShieldCheck} title="Browse comfort" detail="Use private browsing and blur controls." />
          <Toggle
            label="Browse anonymously"
            checked={settings?.anonymous_viewing ?? false}
            onChange={(value) => settingsMutation.mutate({ anonymous_viewing: value })}
          />
          <Toggle
            label="Blur profile image"
            checked={settings?.blur_profile_image ?? false}
            onChange={(value) => settingsMutation.mutate({ blur_profile_image: value })}
          />
        </section>

        <section className="mb-4 rounded-lg border border-[#EADDD2] bg-white p-4">
          <SectionTitle icon={SlidersHorizontal} title="Match preferences" detail="Basic filters are powered by profile and preference APIs." />
          <button onClick={() => router.push("/profile/edit")} className="mt-3 h-11 w-full rounded-md bg-[#7A2432] text-sm font-semibold text-white">
            Update profile and preferences
          </button>
        </section>

        <section className="mb-4 rounded-lg border border-[#EADDD2] bg-white p-4">
          <SectionTitle icon={UserRound} title="Blocked contacts" detail="People you block are hidden from discover and chat." />
          {blocked.length === 0 && <p className="mt-3 text-sm text-[#746767]">No blocked users.</p>}
          <div className="mt-3 space-y-2">
            {blocked.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-[#EADDD2] p-3">
                <span className="text-sm">{item.blocked_email}</span>
                <button onClick={() => unblockMutation.mutate(item.blocked_profile_id)} className="text-sm font-semibold text-[#7A2432]">
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 grid grid-cols-2 gap-3">
          <button onClick={() => router.push("/college")} className="rounded-lg border border-[#EADDD2] bg-white p-4 text-left">
            <GraduationCap className="mb-3 h-5 w-5 text-[#7A2432]" />
            <span className="block font-semibold">College Mode</span>
            <span className="block text-xs text-[#746767]">Student verification</span>
          </button>
          <button className="rounded-lg border border-[#EADDD2] bg-white p-4 text-left">
            <Bell className="mb-3 h-5 w-5 text-[#7A2432]" />
            <span className="block font-semibold">Subscription</span>
            <span className="block text-xs text-[#746767]">Minimal MVP emphasis</span>
          </button>
        </section>

        {/* Logout */}
        <section className="mb-8">
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-sm font-semibold text-[#7A2432] disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {logout.isPending ? "Logging out..." : "Log out"}
          </button>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="mb-3 flex gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F8EFE6] text-[#7A2432]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm leading-6 text-[#746767]">{detail}</p>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between border-t border-[#EADDD2] py-3 text-sm font-medium">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#7A2432]"
      />
    </label>
  );
}