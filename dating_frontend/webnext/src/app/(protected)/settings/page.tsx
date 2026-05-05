import SettingsPage from "@/features/profile/components/SettingsPage";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies(); // ✅ MUST be awaited
  const token = cookieStore.get("access");

  if (!token) {
    redirect("/login");
  }

  return <SettingsPage />;
}
// import SettingsPage from "@/features/profile/components/SettingsPage";

// export default function Page() {
//   return <SettingsPage />;
// }