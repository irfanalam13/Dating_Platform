import SettingsPage from "@/features/profile/components/SettingsPage";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {

  return <SettingsPage />;
}
// import SettingsPage from "@/features/profile/components/SettingsPage";

// export default function Page() {
//   return <SettingsPage />;
// }