import { MvpShell } from "@/shared/ui/mvp-shell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MvpShell>{children}</MvpShell>;
}
