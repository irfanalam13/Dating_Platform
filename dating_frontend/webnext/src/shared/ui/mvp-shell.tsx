"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, HeartHandshake, Home, MessageCircle, Settings, UserRound } from "lucide-react";

const nav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: HeartHandshake },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/notification", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MvpShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/chat/") || pathname === "/profile/edit";

  return (
    <>
      {children}
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EADDD2] bg-white/95 px-2 py-2 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-6">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium ${active ? "text-[#7A2432]" : "text-[#746767]"}`}>
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
