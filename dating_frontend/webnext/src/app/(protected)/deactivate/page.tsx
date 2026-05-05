import AccountDeactivationPage from "@/features/profile/components/deactive";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies(); // ✅ MUST be awaited
  const token = cookieStore.get("access");

  if (!token) {
    redirect("/login");
  }

  return <AccountDeactivationPage />;
}